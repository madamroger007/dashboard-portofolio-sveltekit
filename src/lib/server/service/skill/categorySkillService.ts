import { type CreateCategorySkills, type UpdateCategorySkills } from '$lib/types/schema';
import { createCategorySkillRepository, getAllCategorySkillRepository, getCategorySkillByIdRepository, updateCategorySkillRepository, deleteCategorySkillRepository } from '$lib/server/repositories/skill/categorySkillRepository';
import { fail, type RequestEvent } from '@sveltejs/kit';
import generateId from '$lib/utils/generateId';

export async function createCategorySkillService(event: RequestEvent, data: CreateCategorySkills) {
    try {
        const categoryId = generateId();

        await createCategorySkillRepository({ ...data, id: categoryId, updatedAt: new Date() });
        return {
            success: true,
            status: 200,
            message: 'Categories created successfully'
        };
    } catch {
        return fail(500, { message: 'An error has occurred' });
    }

}

export async function getAllCategorySkillsService() {
    try {
        return await getAllCategorySkillRepository();
    } catch {
        return fail(500, { message: 'An error has occurred' });
    }
}
export async function getCategorySkillsByIdService(id: string) {
    try {
        return await getCategorySkillByIdRepository(id);
    } catch {
        return fail(500, { message: 'An error has occurred' });
    }
}
export async function updateCategorySkillService(event: RequestEvent, id: string, data: Partial<UpdateCategorySkills>) {
    try {
        await updateCategorySkillRepository(id, data);
        return {
            success: true,
            status: 200,
            message: 'Categories updated successfully'
        };
    } catch {
        return fail(500, { message: 'An error has occurred' });
    }
}
export async function deleteCategorySkillsService(event: RequestEvent, id: string) {
    try {
        await deleteCategorySkillRepository(id);
        return {
            success: true,
            status: 200,
            message: 'Categories deleted successfully'
        };
    } catch {
        return fail(500, { message: 'An error has occurred' });
    }
}