import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import * as certifService from '$lib/server/service/certifService';
import * as certifRepository from '$lib/server/repositories/certifRepository';
import { certifSchema } from '$lib/validation/certif-schema';
import type { UpdateCertification } from '$lib/types/schema';
export const load: PageServerLoad = async ({ url }) => {
    const id = url.searchParams.get('id');
    if (id) {
        // ambil dari DB
        const certification = await certifRepository.getCertifByIdRepository(id);
        if (!certification) {
            throw redirect(404, '/dashboard/certification');
        }
        return {
            certification: { id: certification.id, title: certification.title, link_cert: certification.link_cert, name_institution: certification.name_institution, time_cert: certification.time_cert }, isEdit: true
        };
    }
    return {
        certification: { title: '', link_cert: '', name_institution: '', time_cert: '' },
        isEdit: false
    };
};

export const actions: Actions = {
    saveData: async (event) => {
        const formData = Object.fromEntries(await event.request.formData());
        const id = formData.id as string | undefined;

        const parsed = certifSchema.safeParse(formData);
        if (!parsed.success) {
            const errors = parsed.error.issues.map((err) => ({
                field: err.path[0],
                message: err.message
            }));
            return fail(400, { error: true, errors });
        }

        const data: UpdateCertification = {
            title: parsed.data.title,
            link_cert: parsed.data.link_cert,
            name_institution: parsed.data.name_institution,
            time_cert: parsed.data.time_cert.toISOString(),
            updatedAt: new Date()
        };

        const response = id
            ? await certifService.updateCertifService(event, data, id)
            : await certifService.createCertifService(event, { ...data, createdAt: new Date(), });

        if (response.status !== 200) {
            return response;
        }

        throw redirect(302, '/dashboard/certification');
    }
};
