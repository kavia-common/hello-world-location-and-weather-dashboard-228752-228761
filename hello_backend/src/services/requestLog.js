const sqlite3 = require('sqlite3').verbose();
const { getSqliteDbPath } = require('../db/sqlite');
const path = require('path');

/**
 * RequestLogService writes request metadata to SQLite.
 * It is resilient: it will attempt the preferred DB path first, and if open fails,
 * it will retry using a local fallback DB path.
 */
class RequestLogService {
  constructor() {
    this._db = null;
    this._initialized = false;
    this._initializing = null;
  }

  _getFallbackDbPath() {
    // local DB inside hello_backend/
    return path.resolve(__dirname, '..', '..', 'myapp.db');
  }

  _openDb(dbPath) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(db);
      });
    });
  }

  _run(db, sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this);
      });
    });
  }

  async _ensureSchema(db) {
    // Keep schema consistent with hello_database/init_db.py
    await this._run(
      db,
      `
      CREATE TABLE IF NOT EXISTS request_logs (
        id INTEGER PRIMARY KEY,
        route TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        ip TEXT,
        user_agent TEXT,
        location TEXT,
        temperature REAL,
        units TEXT
      )
      `
    );

    await this._run(db, 'CREATE INDEX IF NOT EXISTS idx_request_logs_timestamp ON request_logs(timestamp)');
    await this._run(db, 'CREATE INDEX IF NOT EXISTS idx_request_logs_route ON request_logs(route)');
  }

  async init() {
    if (this._initialized) return;
    if (this._initializing) return this._initializing;

    this._initializing = (async () => {
      const preferred = getSqliteDbPath();

      try {
        this._db = await this._openDb(preferred);
      } catch (e) {
        // Retry with fallback inside backend container
        const fallback = this._getFallbackDbPath();
        this._db = await this._openDb(fallback);
      }

      // Small pragmas for concurrency/safety; safe even if already set elsewhere.
      await this._run(this._db, 'PRAGMA journal_mode = WAL');
      await this._run(this._db, 'PRAGMA foreign_keys = ON');

      await this._ensureSchema(this._db);

      this._initialized = true;
    })();

    return this._initializing;
  }

  /**
   * PUBLIC_INTERFACE
   * Log a request to the SQLite `request_logs` table.
   *
   * @param {object} entry Log entry fields.
   * @param {string} entry.route Route path (e.g. "/api/hello").
   * @param {number} entry.timestamp Epoch millis.
   * @param {string|null} entry.ip Client IP address.
   * @param {string|null} entry.userAgent User-Agent header.
   * @param {string|null} [entry.location] Optional location (string or JSON string).
   * @param {number|null} [entry.temperature] Optional temperature.
   * @param {string|null} [entry.units] Optional temperature units.
   * @returns {Promise<void>}
   */
  async logRequest(entry) {
    await this.init();

    const {
      route,
      timestamp,
      ip,
      userAgent,
      location = null,
      temperature = null,
      units = null,
    } = entry;

    // Best-effort logging; caller should not fail user request because logging failed.
    try {
      await this._run(
        this._db,
        `
        INSERT INTO request_logs (route, timestamp, ip, user_agent, location, temperature, units)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [route, timestamp, ip, userAgent, location, temperature, units]
      );
    } catch (e) {
      // Swallow errors to avoid impacting API availability.
      // eslint-disable-next-line no-console
      console.error('Failed to write request log:', e && e.message ? e.message : e);
    }
  }
}

module.exports = new RequestLogService();
