import { type ProjectIcon, project_icon } from '$lib/server/db/schema_project';
import { db } from '$lib/server/db/client';
import { eq } from 'drizzle-orm';
export async function createIconProjectRepository(data: ProjectIcon) {
    await db.insert(project_icon).values(data);
}

export async function getAllIconProjectRepository() {
    return await db.select().from(project_icon);
}

export async function getIconProjectByIdRepository(id: string) {
    const [icon] = await db.select().from(project_icon).where(eq(project_icon.id, id));
    return icon;
}

export async function updateIconProjectRepository(id: string, data: Partial<ProjectIcon>) {
    await db.update(project_icon).set(data).where(eq(project_icon.id, id)).returning();
}

export async function deleteIconProjectRepository(id: string) {
    await db.delete(project_icon).where(eq(project_icon.id, id)).returning();
}

