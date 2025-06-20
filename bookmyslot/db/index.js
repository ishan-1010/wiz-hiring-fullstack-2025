const { drizzle } = require('drizzle-orm/sqlite-proxy');
const { migrate } = require('drizzle-orm/sqlite-proxy/migrator');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

let db;

async function getDatabase() {
  if (db) {
    return db;
  }

  // Create database file in the db directory
  const dbPath = path.join(process.cwd(), 'db', 'bookmyslot.db');
  
  // Open SQLite database
  const sqlite = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Create Drizzle instance
  db = drizzle(sqlite);
  
  return db;
}

module.exports = { getDatabase }; 