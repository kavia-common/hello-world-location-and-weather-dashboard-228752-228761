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
  //
  // Directory structure:
  // - <repo_root>/hello-world-location-and-weather-dashboard-228752-228761/hello_backend/src/db/sqlite.js
  // - <repo_root>/hello-world-location-and-weather-dashboard-228752-228762/hello_database/myapp.db
  //
  // So from hello_backend/src/db -> go up 4 levels to <repo_root>.
  const repoRoot = path.resolve(__dirname, '..', '..', '..', '..');

  const helloDatabaseWorkspace = path.join(
    repoRoot,
    'hello-world-location-and-weather-dashboard-228752-228762',
    'hello_database',
    'myapp.db'
  );

  // Fallback: keep a DB in this backend container directory if sibling DB is not present.
  const localBackendDb = path.resolve(__dirname, '..', '..', 'myapp.db');

  // Preferred path first; RequestLogService will retry with fallback if open fails.
  return helloDatabaseWorkspace;
}

module.exports = {
  getSqliteDbPath,
};
