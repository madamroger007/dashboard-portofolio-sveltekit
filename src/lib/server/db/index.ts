import { env } from '$env/dynamic/private';
import * as schema from './schema';

let db: any;

if (process.env.NODE_ENV === 'production') {
  // Neon HTTP (serverless)
  const { drizzle } = await import('drizzle-orm/neon-http');
  const { neon } = await import('@neondatabase/serverless');
  const client = neon(env.DATABASE_URL);
  db = drizzle(client, { schema });
} else {
  // Local Postgres (node-postgres)
  const { drizzle } = await import('drizzle-orm/node-postgres');
  const pkg = await import('pg');
  const client = new pkg.Client({ connectionString: env.DATABASE_URL });
  await client.connect();
  db = drizzle(client, { schema });
}

export { db };
