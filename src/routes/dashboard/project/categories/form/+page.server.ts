import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import * as categoryProjectService from '$lib/server/service/project/categoryProjectService';
import * as categoryProjectRepository from '$lib/server/repositories/project/categoryProjectRepository';
import { categoryprojectSchema } from '$lib/validation/project-schema';
import type { UpdateCategoryProject } from '$lib/types/schema';
import { title } from 'process';
export const load: PageServerLoad = async ({ url }) => {
    const id = url.searchParams.get('id');
    if (id) {
        // ambil dari DB
        const category_project = await categoryProjectRepository.getCategoryProjectByIdRepository(id);
        if (!category_project) {
            throw redirect(404, '/dashboard/project/categories');
        }
        return {
            category_project: { id: category_project.id, title: category_project.title, sub_title: category_project.sub_title }, isEdit: true
        };
    }
    return {
        category_project: { title: '', sub_title: '' },
        isEdit: false
    };
};

export const actions: Actions = {
    saveData: async (event) => {
        const formData = Object.fromEntries(await event.request.formData());
        const id = formData.id as string | undefined;

        // Validasi form
        const parsed = categoryprojectSchema.safeParse(formData);
        if (!parsed.success) {
            const errors = parsed.error.issues.map((err) => ({
                field: err.path[0],
                message: err.message
            }));
            return fail(400, { error: true, errors });
        }

        // Mapping data sesuai tipe
        const data: UpdateCategoryProject = {
            title: parsed.data.title,
            sub_title: parsed.data.sub_title,
            updatedAt: new Date()
        };

        // Execute action (update / create)
        const response = id
            ? await categoryProjectService.updateCategoryProjectService(event, id, data)
            : await categoryProjectService.createCategoryProjectService(event, { ...data, createdAt: new Date(), });

        // Failed → return response
        if (response.status !== 200) {
            return response;
        }

        // Sukses → redirect
        throw redirect(302, '/dashboard/project/categories');
    }
};
