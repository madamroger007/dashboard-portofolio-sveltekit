import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import * as experienceService from '$lib/server/service/experience/experientService';
import * as experienceRepository from '$lib/server/repositories/experience/experienceRepository';
import * as categoryExperienceRepository from '$lib/server/repositories/experience/categoriesRepository';
import { experienceSchema } from '$lib/validation/experience';
import type { UpdateExperience } from '$lib/types/schema';
export const load: PageServerLoad = async ({ url }) => {
    const id = url.searchParams.get('id');
    // ambil semua kategori buat select
    const categories = await categoryExperienceRepository.getAllCategoryExperienceRepository();
    if (id) {
        // ambil dari DB
        const experience = await experienceRepository.getExperienceByIdRepository(id);
        if (!experience) {
            throw redirect(404, '/dashboard/experience');
        }
        return {
            experience: { id: experience.id, title: experience.title, name_institution: experience.name_institution, description: experience.description, time_start: experience.time_start, time_end: experience.time_end, category_id: experience.category_id }, categories, isEdit: true
        };
    }
    return {
        experience: { id: '', title: '', name_institution: '', description: '', time_start: new Date(), time_end: new Date(), category_id: '' },
        categories,
        isEdit: false
    };
};

export const actions: Actions = {
    saveData: async (event) => {
        const formData = Object.fromEntries(await event.request.formData());
        const id = formData.id as string | undefined;

        // Validasi form
        const parsed = experienceSchema.safeParse(formData);
        if (!parsed.success) {
            const errors = parsed.error.issues.map((err) => ({
                field: err.path[0],
                message: err.message
            }));
            return fail(400, { error: true, errors });
        }

        // Mapping data sesuai tipe
        const data: UpdateExperience = {
            title: parsed.data.title,
            name_institution: parsed.data.name_institution,
            description: parsed.data.description,
            time_start: parsed.data.time_start.toISOString(),
            time_end: parsed.data.time_end.toISOString(),
            category_id: parsed.data.category_id,
            updatedAt: new Date()
        };

        // Eksekusi aksi (update / create)
        const response = id
            ? await experienceService.updateExperienceService(event, data, id)
            : await experienceService.createExperienceService(event, { ...data, createdAt: new Date(), });

        // Gagal → balikin response
        if (response.status !== 200) {
            return response;
        }

        // Sukses → redirect
        throw redirect(302, '/dashboard/experience');
    }
};
