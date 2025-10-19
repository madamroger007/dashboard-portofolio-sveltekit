// src/lib/server/db/client.ts
import { schema } from '$lib/server/db/index';

import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

let dbPg: NodePgDatabase<typeof schema> | NeonHttpDatabase<typeof schema> | null = null;

async function getDb() {
	if (dbPg) return dbPg;

	let databaseUrl: string | undefined;

	try {
		const { env } = await import('$env/dynamic/private');
		databaseUrl = env.DATABASE_URL;
	} catch {
		databaseUrl = process.env.DATABASE_URL;
	}

	if (!databaseUrl) {
		throw new Error('❌ DATABASE_URL is not defined');
	}

	if (process.env.NODE_ENV === 'production') {
		// Neon HTTP (serverless)
		const { drizzle } = await import('drizzle-orm/neon-http');
		const { neon } = await import('@neondatabase/serverless');
		const client = neon(databaseUrl);
		dbPg = drizzle(client, { schema });
	} else {
		// Local Postgres (node-postgres)
		const { drizzle } = await import('drizzle-orm/node-postgres');
		const pkg = await import('pg');
		const client = new pkg.Client({ connectionString: databaseUrl });
		await client.connect();
		dbPg = drizzle(client, { schema });
	}

	return dbPg;
}

export const db = await getDb();
