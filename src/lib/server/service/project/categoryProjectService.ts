import { type CreateCategoryProject, type UpdateCategoryProject } from '$lib/types/schema';
import { createCategoryProjectRepository, getAllCategoryProjectRepository, getCategoryProjectByIdRepository, updateCategoryProjectRepository, deleteCategoryProjectRepository } from '$lib/server/repositories/project/categoryProjectRepository';
import { fail, type RequestEvent } from '@sveltejs/kit';
import generateId from '$lib/utils/generateId';

export async function createCategoryProjectService(event: RequestEvent, data: CreateCategoryProject) {
    try {
        const categoryId = generateId();

        await createCategoryProjectRepository({ ...data, id: categoryId, updatedAt: new Date() });
        return {
            success: true,
            status: 200,
            message: 'Categories created successfully'
        };
    } catch (error) {
        return fail(500, { message: error instanceof Error ? error.message : 'An error occurred' });
    }

}

export async function getAllCategoryProjectService() {
    try {
        return await getAllCategoryProjectRepository();
    } catch (error) {
        return fail(500, { message: error instanceof Error ? error.message : 'An error occurred' });
    }
}
export async function getCategoryProjectByIdService(id: string) {
    try {
        return await getCategoryProjectByIdRepository(id);
    } catch (error) {
        return fail(500, { message: error instanceof Error ? error.message : 'An error occurred' });
    }
}
export async function updateCategoryProjectService(event: RequestEvent, id: string, data: Partial<UpdateCategoryProject>) {
    try {
        await updateCategoryProjectRepository(id, data);
        return {
            success: true,
            status: 200,
            message: 'Categories updated successfully'
        };
    } catch (error) {
        return fail(500, { message: error instanceof Error ? error.message : 'An error occurred' });
    }
}
export async function deleteCategoryProjectService(event: RequestEvent, id: string) {
    try {
        await deleteCategoryProjectRepository(id);
        return {
            success: true,
            status: 200,
            message: 'Categories deleted successfully'
        };
    } catch (error) {
        return fail(500, { message: error instanceof Error ? error.message : 'An error occurred' });
    }
}