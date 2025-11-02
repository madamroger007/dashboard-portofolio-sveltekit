import { type CategorySkill, category_skill } from "$lib/server/db/schema_skill";
import { db } from "$lib/server/db/client";
import { eq } from "drizzle-orm";
import { getCache, setCache, delCache } from "$lib/server/repositories/redisRepository";

export async function createCategorySkillRepository(data: CategorySkill): Promise<void> {
  await db.insert(category_skill).values(data);
  await delCache("category-skill:all");
}

export async function getAllCategorySkillRepository(): Promise<CategorySkill[]> {
  const cacheKey = "category-skill:all";
  const cached = await getCache<CategorySkill[]>(cacheKey);
  if (cached) return cached;

  const rows = await db.select().from(category_skill);
  await setCache(cacheKey, rows);
  return rows;
}

export async function getCategorySkillByIdRepository(id: string): Promise<CategorySkill | undefined> {
  const cacheKey = `category-skill:${id}`;
  const cached = await getCache<CategorySkill>(cacheKey);
  if (cached) return cached;

  const [category] = await db.select().from(category_skill).where(eq(category_skill.id, id));
  if (category) await setCache(cacheKey, category);
  return category;
}

export async function updateCategorySkillRepository(
  id: string,
  data: Partial<CategorySkill>
): Promise<void> {
  await db.update(category_skill).set(data).where(eq(category_skill.id, id));
  await delCache(`category-skill:${id}`);
  await delCache("category-skill:all");
}

export async function deleteCategorySkillRepository(id: string): Promise<void> {
  await db.delete(category_skill).where(eq(category_skill.id, id));
  await delCache(`category-skill:${id}`);
  await delCache("category-skill:all");
}
