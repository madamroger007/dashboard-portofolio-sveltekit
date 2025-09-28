import type { UpdateCertification } from "$lib/types/schema";
import { db } from "../../db/client";
import { experience as dataExperience, type Experience, category_experience, } from "../../db/schema_experience";
import { eq } from "drizzle-orm";

export async function createExperienceRepository(data: Experience) {
    await db.insert(dataExperience).values(data);
}
export async function updateExperienceRepository(id: string, data: Partial<UpdateCertification>) {
    await db.update(dataExperience).set(data).where(eq(dataExperience.id, id));
}

export async function deleteExperienceRepository(id: string) {
    await db.delete(dataExperience).where(eq(dataExperience.id, id));
}

export async function getExperienceByIdRepository(id: string): Promise<Experience | undefined> {
    const [experience] = await db.select().from(dataExperience).where(eq(dataExperience.id, id));
    return experience;
}

export async function getAllExperienceRepository(): Promise<
    {
        id: string;
        title: string;
        name_institution: string;
        description: string | null;
        time_start: Date | null;
        time_end: Date | null;
        category_id: string;
        createdAt: Date;
        updatedAt: Date;
        category_name: string | null;
    }[]
> {
    const result = await db
        .select({
            id: dataExperience.id,
            title: dataExperience.title,
            name_institution: dataExperience.name_institution,
            description: dataExperience.description,
            time_start: dataExperience.time_start,
            time_end: dataExperience.time_end,
            category_id: dataExperience.category_id,
            createdAt: dataExperience.createdAt,
            updatedAt: dataExperience.updatedAt,
            category_name: category_experience.title
        })
        .from(dataExperience)
        .leftJoin(category_experience, eq(dataExperience.category_id, category_experience.id));

    // cast string → Date
    console.log("🔎 raw result:", result);
    return result.map((row) => ({
        ...row,
        time_start: row.time_start ? new Date(row.time_start) : null,
        time_end: row.time_end ? new Date(row.time_end) : null
    }));
}