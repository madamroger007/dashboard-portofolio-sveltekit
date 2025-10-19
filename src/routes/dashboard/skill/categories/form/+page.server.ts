import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import * as categorySkillService from '$lib/server/service/skill/categorySkillService';
import * as categorySkillRepository from '$lib/server/repositories/skill/categorySkillRepository';
import { categoryskillSchema } from '$lib/validation/skill-schema';
import type { UpdateCategorySkills } from '$lib/types/schema';
export const load: PageServerLoad = async ({ url }) => {
    const id = url.searchParams.get('id');
    if (id) {
        // ambil dari DB
        const category_skill = await categorySkillRepository.getCategorySkillByIdRepository(id);
        if (!category_skill) {
            throw redirect(404, '/dashboard/skill/categories');
        }
        return {
            category_skill: { id: category_skill.id, title: category_skill.title }, isEdit: true
        };
    }
    return {
        category_skill: { title: '' },
        isEdit: false
    };
};

export const actions: Actions = {
    saveData: async (event) => {
        const formData = Object.fromEntries(await event.request.formData());
        const id = formData.id as string | undefined;

        const parsed = categoryskillSchema.safeParse(formData);
        if (!parsed.success) {
            const errors = parsed.error.issues.map((err) => ({
                field: err.path[0],
                message: err.message
            }));
            return fail(400, { error: true, errors });
        }

        const data: UpdateCategorySkills = {
            title: parsed.data.title,
            updatedAt: new Date()
        };

        const response = id
            ? await categorySkillService.updateCategorySkillService(event, id, data)
            : await categorySkillService.createCategorySkillService(event, { ...data, createdAt: new Date(), });

        if (response.status !== 200) {
            return response;
        }

        throw redirect(302, '/dashboard/skill/categories');
    }
};
