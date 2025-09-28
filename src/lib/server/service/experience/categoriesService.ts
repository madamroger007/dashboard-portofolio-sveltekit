import { createCategoryExperienceRepository, deleteCategoryExperienceRepository, updateCategoryExperienceRepository } from '../../repositories/experience/categoriesRepository';
import { fail, type RequestEvent } from '@sveltejs/kit';
import generateId from '$lib/utils/generateId';
import type { CreateCategoryExperience, UpdateCategoryExperience } from "$lib/types/schema";
export async function createCategoryExperienceService(event: RequestEvent, data: CreateCategoryExperience) {
    const experienceId = generateId();
    try {
        await createCategoryExperienceRepository({ ...data, id: experienceId, updatedAt: new Date() });
        return {
            success: true,
            status: 200,
            message: 'Experience created successfully'
        }
    } catch {
        return fail(500, { message: 'An error has occurred' });
    }
}

export async function updateCategoryExperienceService(event: RequestEvent, data: UpdateCategoryExperience, id: string) {
    try {
        await updateCategoryExperienceRepository(id, data);

        return {
            success: true,
            status: 200,
            message: 'Experience updated successfully'
        }
    } catch {
        return fail(500, { message: 'An error has occurred' });
    }
}

export async function deleteCategoryExperienceService(event: RequestEvent, id: string) {
    try {
        await deleteCategoryExperienceRepository(id);

        return {
            success: true,
            status: 200,
            message: 'Experience deleted successfully'
        }
    } catch {
        return fail(500, { message: 'An error has occurred' });
    }
}