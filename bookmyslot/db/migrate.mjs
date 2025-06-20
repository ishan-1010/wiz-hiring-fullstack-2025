import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { createClient } from '@libsql/client';
import path from 'path';

// This needs to be run from the `bookmyslot` directory
const client = createClient({
  url: `file:${path.join(process.cwd(), 'db', 'bookmyslot.db')}`,
});

const db = drizzle(client);

async function main() {
  try {
    console.log('Running migrations...');
    await migrate(db, { migrationsFolder: 'db/migrations' });
    console.log('Migrations completed successfully!');
    client.close();
    process.exit(0);
  } catch (error) {
    console.error('Error running migrations:', error);
    client.close();
    process.exit(1);
  }
}

main(); 