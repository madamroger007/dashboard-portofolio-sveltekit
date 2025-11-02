import { db } from '$lib/server/db/client';
import { category_project, type CategoryProject } from '$lib/server/db/schema_project';
import { eq } from 'drizzle-orm';
import { getCache, setCache, delCache } from '$lib/server/repositories/redisRepository';

// === CREATE ===
export async function createCategoryProjectRepository(data: CategoryProject) {
    await db.insert(category_project).values(data);
    await delCache('project:categories:*');
}

// === READ ALL ===
export async function getAllCategoryProjectRepository(): Promise<CategoryProject[]> {
    const cacheKey = 'project:categories:all';
    const cached = await getCache<CategoryProject[]>(cacheKey);
    if (cached) return cached;

    const result = await db.select().from(category_project);
    await setCache(cacheKey, result);
    return result;
}

// === READ BY ID ===
export async function getCategoryProjectByIdRepository(id: string): Promise<CategoryProject | undefined> {
    const cacheKey = `project:categories:${id}`;
    const cached = await getCache<CategoryProject>(cacheKey);
    if (cached) return cached;

    const [category] = await db.select().from(category_project).where(eq(category_project.id, id));
    if (category) await setCache(cacheKey, category);
    return category;
}

// === UPDATE ===
export async function updateCategoryProjectRepository(id: string, data: Partial<CategoryProject>) {
    await db.update(category_project).set(data).where(eq(category_project.id, id));
    await delCache(`project:categories:${id}`);
    await delCache('project:categories:all');
}

// === DELETE ===
export async function deleteCategoryProjectRepository(id: string) {
    await db.delete(category_project).where(eq(category_project.id, id));
    await delCache(`project:categories:${id}`);
    await delCache('project:categories:all');
}
