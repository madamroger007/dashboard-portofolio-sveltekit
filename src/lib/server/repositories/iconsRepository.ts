import { db } from '$lib/server/db/client';
import { icons, type Icon } from '$lib/server/db/schema_icons';
import { eq } from 'drizzle-orm';
import { getCache, setCache, delCache } from '$lib/server/repositories/redisRepository';

// === CREATE ===
export async function createIconRepository(data: Icon) {
	await db.insert(icons).values(data);
	await delCache('icons:*');
}

// === READ ALL ===
export async function getAllIconRepository(): Promise<Icon[]> {
	const cacheKey = 'icons:all';
	const cached = await getCache<Icon[]>(cacheKey);
	if (cached) return cached;

	const result = await db.select().from(icons);
	await setCache(cacheKey, result);
	return result;
}

// === READ BY ID ===
export async function getIconByIdRepository(id: string): Promise<Icon | undefined> {
	const cacheKey = `icons:${id}`;
	const cached = await getCache<Icon>(cacheKey);
	if (cached) return cached;

	const [icon] = await db.select().from(icons).where(eq(icons.id, id));
	if (icon) await setCache(cacheKey, icon);
	return icon;
}

// === UPDATE ===
export async function updateIconRepository(id: string, data: Partial<Icon>) {
	await db.update(icons).set(data).where(eq(icons.id, id));
	await delCache(`icons:${id}`);
	await delCache('icons:all');
}

// === DELETE ===
export async function deleteIconRepository(id: string) {
	await db.delete(icons).where(eq(icons.id, id));
	await delCache(`icons:${id}`);
	await delCache('icons:all');
}
