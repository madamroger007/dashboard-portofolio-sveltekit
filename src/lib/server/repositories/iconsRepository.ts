import { type Icon, icons } from '$lib/server/db/schema_icons';
import { db } from '$lib/server/db/client';
import { eq } from 'drizzle-orm';
export async function createIconRepository(data: Icon) {
    await db.insert(icons).values(data);
}

export async function getAllIconRepository() {
    return await db.select().from(icons);
}

export async function getIconByIdRepository(id: string) {
    const [icon] = await db.select().from(icons).where(eq(icons.id, id));
    return icon;
}

export async function updateIconRepository(id: string, data: Partial<Icon>) {
    await db.update(icons).set(data).where(eq(icons.id, id)).returning();
}

export async function deleteIconRepository(id: string) {
    await db.delete(icons).where(eq(icons.id, id)).returning();
}

