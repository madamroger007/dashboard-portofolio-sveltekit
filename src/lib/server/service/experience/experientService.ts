import { createExperienceRepository, deleteExperienceRepository, getAllExperienceRepository, getExperienceByIdRepository, updateExperienceRepository } from '../../repositories/experience/experienceRepository';
import { fail, type RequestEvent } from '@sveltejs/kit';
import generateId from '$lib/utils/generateId';
import type { CreateExperience, UpdateExperience } from "$lib/types/schema";
export async function createExperienceService(event: RequestEvent, data: CreateExperience) {
    const experienceId = generateId();
    try {
        await createExperienceRepository({ ...data, id: experienceId, updatedAt: new Date() });
        return {
            success: true,
            status: 200,
            message: 'Experience created successfully'
        }
    } catch {
        return fail(500, { message: 'An error has occurred' });
    }
}

export async function updateExperienceService(event: RequestEvent, data: UpdateExperience, id: string) {
    try {
        await updateExperienceRepository(id, data);

        return {
            success: true,
            status: 200,
            message: 'Experience updated successfully'
        }
    } catch {
        return fail(500, { message: 'An error has occurred' });
    }
}

export async function deleteExperienceService(event: RequestEvent, id: string) {
    try {
        await deleteExperienceRepository(id);

        return {
            success: true,
            status: 200,
            message: 'Experience deleted successfully'
        }
    } catch {
        return fail(500, { message: 'An error has occurred' });
    }
}