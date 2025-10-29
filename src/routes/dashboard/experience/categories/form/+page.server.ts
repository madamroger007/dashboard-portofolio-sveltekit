import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import * as categoryExperienceService from '$lib/server/service/experience/categoriesService';
import { categoryexperienceSchema } from '$lib/validation/experience';
import type { UpdateCategoryExperience } from '$lib/types/schema';
import { type CategoryExperience } from '$lib/server/db/schema_experience';
export const load: PageServerLoad = async ({ url }) => {
    const id = url.searchParams.get('id');
    if (id) {
        const result = await categoryExperienceService.getCategoryExperienceByIdService(id);
        const category_experience: CategoryExperience | null = result === undefined ? null : result as CategoryExperience;
        if (!category_experience) {
            throw redirect(404, '/dashboard/experience/categories');
        }
        return {
            category_experience: { id: category_experience.id, title: category_experience.title, sub_title: category_experience.sub_title }, isEdit: true
        };
    }
    return {
        category_experience: { title: '', sub_title: '' },
        isEdit: false
    };
};

export const actions: Actions = {
    saveData: async (event) => {
        const formData = Object.fromEntries(await event.request.formData());
        const id = formData.id as string | undefined;

        const parsed = categoryexperienceSchema.safeParse(formData);
        if (!parsed.success) {
            const errors = parsed.error.issues.map((err) => ({
                field: err.path[0],
                message: err.message
            }));
            return fail(400, { error: true, errors });
        }

        const data: UpdateCategoryExperience = {
            title: parsed.data.title,
            sub_title: parsed.data.sub_title,
            updatedAt: new Date()
        };

        const response = id
            ? await categoryExperienceService.updateCategoryExperienceService(event, data, id)
            : await categoryExperienceService.createCategoryExperienceService(event, { ...data, createdAt: new Date(), });

        if (response.status !== 200) {
            return response;
        }

        throw redirect(302, '/dashboard/experience/categories');
    }
};
