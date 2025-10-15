import { type CategoryProject, category_project } from '$lib/server/db/schema_project';
import { db } from '$lib/server/db/client';
import { eq } from 'drizzle-orm';
export async function createCategoryProjectRepository(data: CategoryProject) {
    await db.insert(category_project).values(data);
}

export async function getAllCategoryProjectRepository() {
    return await db.select().from(category_project);
}

export async function getCategoryProjectByIdRepository(id: string) {
    const [category] = await db.select().from(category_project).where(eq(category_project.id, id));
    return category;
}

export async function updateCategoryProjectRepository(id: string, data: Partial<CategoryProject>) {
    await db.update(category_project).set(data).where(eq(category_project.id, id)).returning();
}

export async function deleteCategoryProjectRepository(id: string) {
    await db.delete(category_project).where(eq(category_project.id, id)).returning();
}

