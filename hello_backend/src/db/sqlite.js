const path = require('path');

/**
 * Returns an absolute path to a stable SQLite database file.
 *
 * Preference order:
 * 1) The database owned by the hello_database container/workspace (../hello_database/myapp.db)
 * 2) A local copy next to this backend container (./myapp.db)
 *
 * This avoids introducing required .env variables while staying compatible with the existing hello_database init script.
 *
 * @returns {string} Absolute path to the sqlite DB file.
 */
function getSqliteDbPath() {
  // Current file: hello_backend/src/db/sqlite.js
  // Repo structure places hello_database as a sibling workspace at:
  //   <repo>/hello-world-location-and-weather-dashboard-.../hello_database/myapp.db
  // ...and this backend at:
  //   <repo>/hello-world-location-and-weather-dashboard-.../hello_backend
  //
  // So from hello_backend/src/db -> go up 3 to /code-generation then into sibling workspace.
  const repoRoot = path.resolve(__dirname, '..', '..', '..');
  const helloDatabaseWorkspace = path.join(
    repoRoot,
    'hello-world-location-and-weather-dashboard-228752-228762',
    'hello_database',
    'myapp.db'
  );

  // Fallback: keep a DB in this backend container directory if sibling DB is not present.
  const localBackendDb = path.resolve(__dirname, '..', '..', 'myapp.db');

  // We intentionally do not fs.existsSync here to avoid extra I/O and to keep behavior deterministic.
  // The logger will attempt to open the preferred path; if it fails, it will retry with fallback.
  return helloDatabaseWorkspace || localBackendDb;
}

module.exports = {
  getSqliteDbPath,
};
