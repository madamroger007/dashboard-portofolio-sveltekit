import { createIconRepository, updateIconRepository, deleteIconRepository, getIconByIdRepository, getAllIconRepository } from '../repositories/iconsRepository';
import { fail, type RequestEvent } from '@sveltejs/kit';
import generateId from '$lib/utils/generateId';
import type { CreateIcon, UpdateIcon } from "$lib/types/schema";
import { cloudinaryService } from '$lib/server/service/cloudinaryService';

export async function createIconService(event: RequestEvent, data: CreateIcon) {
    const iconId = generateId();
    try {
        await createIconRepository({ ...data, id: iconId, updatedAt: new Date() });
        return {
            success: true,
            status: 200,
            message: 'Icons created successfully'
        }
    } catch (error) {
        return fail(500, { message: error instanceof Error ? error.message : 'An error occurred' });
    }
}

export async function updateIconService(event: RequestEvent, data: UpdateIcon, id: string) {
    try {
        await updateIconRepository(id, data);

        return {
            success: true,
            status: 200,
            message: 'Icon updated successfully'
        }
    } catch (error) {
        return fail(500, { message: error instanceof Error ? error.message : 'An error occurred' });
    }
}

export async function deleteIconService(event: RequestEvent, id: string) {
    try {
        const data = await getIconByIdRepository(id);
        if (!data?.publicId) {
            return fail(400, { message: 'Icon not found' })
        }
        await cloudinaryService.deleteImage(data.publicId);
        await deleteIconRepository(id);

        return {
            success: true,
            status: 200,
            message: 'Icons deleted successfully'
        }
    } catch (error) {
        return fail(500, { message: error instanceof Error ? error.message : 'An error occurred' });
    }
}

export async function getAllIconService() {
    try {
        const icons = await getAllIconRepository();
        return icons
    } catch (error) {
        return fail(500, { message: error instanceof Error ? error.message : 'An error occurred' });
    }
}

export async function getIconByIdService(id: string) {
    try {
        const icon = await getIconByIdRepository(id);
        return icon
    } catch (error) {
        return fail(500, { message: error instanceof Error ? error.message : 'An error occurred' });
    }
}