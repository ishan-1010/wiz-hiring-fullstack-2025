import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { migrate } from 'drizzle-orm/libsql/migrator';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  // Require Turso database URL and auth token
  const databaseUrl = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!databaseUrl) {
    console.error('Error: TURSO_DATABASE_URL environment variable is required');
    process.exit(1);
  }

  if (!authToken) {
    console.error('Error: TURSO_AUTH_TOKEN environment variable is required');
    process.exit(1);
  }

  console.log('Connecting to Turso database:', databaseUrl);

  const client = createClient({
    url: databaseUrl,
    authToken: authToken,
  });

  const db = drizzle(client);

  console.log('Running migrations...');
  
  try {
    await migrate(db, { migrationsFolder: path.join(__dirname, 'migrations') });
    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main(); 