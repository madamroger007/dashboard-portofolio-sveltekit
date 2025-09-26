import { type Certification } from "../db/schema_certification";
import { deleteCertifRepository, createCertifRepository, updateCertifRepository } from '../repositories/certifRepository';
import { fail, redirect, type RequestEvent } from '@sveltejs/kit';
import generateId from '$lib/utils/generateId';
import type { UpdateCertification, CreateCertification } from "$lib/types/schema";
export async function createCertifService(event: RequestEvent, data: CreateCertification) {
    const certifId = generateId();
    try {
        await createCertifRepository({ ...data, id: certifId, updatedAt: new Date() });
        return {
            success: true,
            status: 200,
            message: 'Certification created successfully'
        }
    } catch {
        return fail(500, { message: 'An error has occurred' });
    }
}

export async function updateCertifService(event: RequestEvent, data: UpdateCertification, id: string) {
    try {
        await updateCertifRepository(id, data);

        return {
            success: true,
            status: 200,
            message: 'Certification updated successfully'
        }
    } catch {
        return fail(500, { message: 'An error has occurred' });
    }
}

export async function deleteCertifService(event: RequestEvent, id: string) {
    try {
        await deleteCertifRepository(id);

        return {
            success: true,
            status: 200,
            message: 'Certification deleted successfully'
        }
    } catch {
        return fail(500, { message: 'An error has occurred' });
    }
}