import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import * as experienceService from '$lib/server/service/experience/experientService';
import * as categoryExperienceService from '$lib/server/service/experience/categoriesService';
import { experienceSchema } from '$lib/validation/experience';
import type { UpdateExperience } from '$lib/types/schema';
import { type Experience } from '$lib/server/db/schema_experience';
export const load: PageServerLoad = async ({ url }) => {
    const id = url.searchParams.get('id');
    const categories = await categoryExperienceService.getCategoriesExperienceAllService();
    if (id) {
        const result = await experienceService.getExperienceByIdService(id);
        const experience: Experience | null = result === undefined ? null : result as Experience;
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

        const parsed = experienceSchema.safeParse(formData);
        if (!parsed.success) {
            const errors = parsed.error.issues.map((err) => ({
                field: err.path[0],
                message: err.message
            }));
            return fail(400, { error: true, errors });
        }

        const data: UpdateExperience = {
            title: parsed.data.title,
            name_institution: parsed.data.name_institution,
            description: parsed.data.description,
            time_start: parsed.data.time_start.toISOString(),
            time_end: parsed.data.time_end.toISOString(),
            category_id: parsed.data.category_id,
            updatedAt: new Date()
        };

        const response = id
            ? await experienceService.updateExperienceService(event, data, id)
            : await experienceService.createExperienceService(event, { ...data, createdAt: new Date(), });

        if (response.status !== 200) {
            return response;
        }

        throw redirect(302, '/dashboard/experience');
    }
};
