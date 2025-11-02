import { db } from '$lib/server/db/client';
import {
	experience as dataExperience,
	category_experience
} from '$lib/server/db/schema_experience';
import type { Experience } from '$lib/server/db/schema_experience';
import { eq } from 'drizzle-orm';
import { getCache, setCache, delCache } from '$lib/server/repositories/redisRepository';

// === CREATE ===
export async function createExperienceRepository(data: Experience) {
	await db.insert(dataExperience).values(data);
	await delCache('experience:all');
}

// === READ ALL ===
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
	const cacheKey = 'experience:all';
	const cached = await getCache<{
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
	}[]>(cacheKey);
	if (cached) return cached;

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

	const formatted = result.map((row) => ({
		...row,
		time_start: row.time_start ? new Date(row.time_start) : null,
		time_end: row.time_end ? new Date(row.time_end) : null
	}));

	await setCache(cacheKey, formatted);
	return formatted;
}

// === READ BY ID ===
export async function getExperienceByIdRepository(id: string): Promise<Experience | undefined> {
	const cacheKey = `experience:${id}`;
	const cached = await getCache<Experience>(cacheKey);
	if (cached) return cached;

	const [experience] = await db.select().from(dataExperience).where(eq(dataExperience.id, id));
	if (experience) await setCache(cacheKey, experience);
	return experience;
}

// === UPDATE ===
export async function updateExperienceRepository(id: string, data: Partial<Experience>) {
	await db.update(dataExperience).set(data).where(eq(dataExperience.id, id));
	await delCache(`experience:${id}`);
	await delCache('experience:all');
}

// === DELETE ===
export async function deleteExperienceRepository(id: string) {
	await db.delete(dataExperience).where(eq(dataExperience.id, id));
	await delCache(`experience:${id}`);
	await delCache('experience:all');
}
