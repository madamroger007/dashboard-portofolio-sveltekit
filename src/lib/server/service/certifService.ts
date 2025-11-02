import { deleteCertifRepository, createCertifRepository, updateCertifRepository, getCertifAllRepository, getCertifByIdRepository } from '../repositories/certifRepository';
import { fail, type RequestEvent } from '@sveltejs/kit';
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
	} catch (error) {
		return fail(500, { message: error instanceof Error ? error.message : 'An error occurred' });
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
	} catch (error) {
		return fail(500, { message: error instanceof Error ? error.message : 'An error occurred' });
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
	} catch (error) {
		return fail(500, { message: error instanceof Error ? error.message : 'An error occurred' });
	}
}

export async function getCertifAllService() {
    try {
        const certif = await getCertifAllRepository();
        return certif;
	} catch (error) {
		return fail(500, { message: error instanceof Error ? error.message : 'An error occurred' });
	}
}

export async function getCertifByIdService(id: string) {
    try {
        const certif = await getCertifByIdRepository(id);
        return certif;
	} catch (error) {
		return fail(500, { message: error instanceof Error ? error.message : 'An error occurred' });
	}
}