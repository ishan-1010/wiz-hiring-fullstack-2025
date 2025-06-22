const { drizzle } = require('drizzle-orm/libsql');
const { createClient } = require('@libsql/client');

let db;

async function getDatabase() {
  if (db) {
    return db;
  }

  // Require Turso database URL and auth token
  const databaseUrl = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!databaseUrl) {
    throw new Error('TURSO_DATABASE_URL environment variable is required');
  }

  if (!authToken) {
    throw new Error('TURSO_AUTH_TOKEN environment variable is required');
  }

  const client = createClient({
    url: databaseUrl,
    authToken: authToken,
  });

  // Create Drizzle instance
  db = drizzle(client);
  
  return db;
}

module.exports = { getDatabase }; 