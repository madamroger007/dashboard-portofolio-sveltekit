import type { UpdateCertification } from "$lib/types/schema";
import { db } from "../../db/client";
import { category_experience as dataExperience, type CategoryExperience } from "../../db/schema_experience";
import { eq } from "drizzle-orm";

export async function createCategoryExperienceRepository(data: CategoryExperience) {
    await db.insert(dataExperience).values(data);
}
export async function updateCategoryExperienceRepository(id: string, data: Partial<UpdateCertification>) {
    await db.update(dataExperience).set(data).where(eq(dataExperience.id, id));
}

export async function deleteCategoryExperienceRepository(id: string) {
    await db.delete(dataExperience).where(eq(dataExperience.id, id));
}

export async function getCategoryExperienceByIdRepository(id: string): Promise<CategoryExperience | undefined> {
    const [experience] = await db.select().from(dataExperience).where(eq(dataExperience.id, id));
    return experience;
}

export async function getAllCategoryExperienceRepository(): Promise<CategoryExperience[]> {
    const experience = await db.select().from(dataExperience);
    return experience;
}