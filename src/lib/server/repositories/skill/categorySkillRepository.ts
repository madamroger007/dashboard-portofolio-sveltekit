import { type CategorySkill, category_skill } from '$lib/server/db/schema_skill';
import { db } from '$lib/server/db/client';
import { eq } from 'drizzle-orm';
export async function createCategorySkillRepository(data: CategorySkill) {
    await db.insert(category_skill).values(data);
}

export async function getAllCategorySkillRepository() {
    return await db.select().from(category_skill);
}

export async function getCategorySkillByIdRepository(id: string) {
    const [category] = await db.select().from(category_skill).where(eq(category_skill.id, id));
    return category;
}

export async function updateCategorySkillRepository(id: string, data: Partial<CategorySkill>) {
    await db.update(category_skill).set(data).where(eq(category_skill.id, id)).returning();
}

export async function deleteCategorySkillRepository(id: string) {
    await db.delete(category_skill).where(eq(category_skill.id, id)).returning();
}

