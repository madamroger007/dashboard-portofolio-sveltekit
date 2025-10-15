import { createIconProjectRepository, updateIconProjectRepository, deleteIconProjectRepository, getIconProjectByIdRepository } from '../../repositories/project/iconsProjectRepository';
import { fail, type RequestEvent } from '@sveltejs/kit';
import generateId from '$lib/utils/generateId';
import type { CreateProjectIcon, UpdateProjectIcon } from "$lib/types/schema";
import { cloudinaryRepository } from '$lib/server/repositories/cloudinaryRepository';

export async function createIconProjectService(event: RequestEvent, data: CreateProjectIcon) {
    const iconProjectId = generateId();
    try {
        await createIconProjectRepository({ ...data, id: iconProjectId, updatedAt: new Date() });
        return {
            success: true,
            status: 200,
            message: 'Icons created successfully'
        }
    } catch {
        return fail(500, { message: 'An error has occurred' })
    }
}

export async function updateIconProjectService(event: RequestEvent, data: UpdateProjectIcon, id: string) {
    try {
        await updateIconProjectRepository(id, data);

        return {
            success: true,
            status: 200,
            message: 'Icon updated successfully'
        }
    } catch {
        return fail(500, { message: 'An error has occurred' })
    }
}

export async function deleteIconProjectService(event: RequestEvent, id: string) {
    try {
        const { publicId } = await getIconProjectByIdRepository(id);
        if (!publicId) {
            return fail(400, { message: 'Icon not found' })
        }
        await cloudinaryRepository.deleteImage(publicId);
        await deleteIconProjectRepository(id);

        return {
            success: true,
            status: 200,
            message: 'Icons deleted successfully'
        }
    } catch {
        return fail(500, { message: 'An error has occurred' })
    }
}