import { db } from '$lib/server/db/client';
import { category_experience as dataExperience, type CategoryExperience } from '$lib/server/db/schema_experience';
import { eq } from 'drizzle-orm';
import { getCache, setCache, delCache } from '$lib/server/repositories/redisRepository';

// === CREATE ===
export async function createCategoryExperienceRepository(data: CategoryExperience) {
    await db.insert(dataExperience).values(data);
    await delCache('experience:categories:*');
}

// === READ ALL ===
export async function getAllCategoryExperienceRepository(): Promise<CategoryExperience[]> {
    const cacheKey = 'experience:categories:all';
    const cached = await getCache<CategoryExperience[]>(cacheKey);
    if (cached) return cached;

    const result = await db.select().from(dataExperience);
    await setCache(cacheKey, result);
    return result;
}

// === READ BY ID ===
export async function getCategoryExperienceByIdRepository(id: string): Promise<CategoryExperience | undefined> {
    const cacheKey = `experience:categories:${id}`;
    const cached = await getCache<CategoryExperience>(cacheKey);
    if (cached) return cached;

    const [experience] = await db.select().from(dataExperience).where(eq(dataExperience.id, id));
    if (experience) await setCache(cacheKey, experience);
    return experience;
}

// === UPDATE ===
export async function updateCategoryExperienceRepository(id: string, data: Partial<CategoryExperience>) {
    await db.update(dataExperience).set(data).where(eq(dataExperience.id, id));
    await delCache(`experience:categories:${id}`);
    await delCache('experience:categories:all');
}

// === DELETE ===
export async function deleteCategoryExperienceRepository(id: string) {
    await db.delete(dataExperience).where(eq(dataExperience.id, id));
    await delCache(`experience:categories:${id}`);
    await delCache('experience:categories:all');
}
