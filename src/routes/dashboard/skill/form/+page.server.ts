import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import * as skillService from '$lib/server/service/skill/skillService';
import * as categorySkillService from '$lib/server/service/skill/categorySkillService';
import * as iconService from '$lib/server/service/iconsService';
import { skillSchema } from '$lib/validation/skill-schema';
import type { UpdateSkills } from '$lib/types/schema';

export const load: PageServerLoad = async ({ url }) => {
	const id = url.searchParams.get('id');

	const categories = await categorySkillService.getAllCategorySkillsService();
	const icons = await iconService.getAllIconService();

	if (id) {
		const skill = await skillService.getSkillByIdService(id);
		if (!skill) {
			throw redirect(404, '/dashboard/skill');
		}

		const iconIds = skill.icons ? skill.icons.map((icon: any) => icon.id) : [];
		return {
			skill: {
				skillId: skill.id,
				title: skill.title,
				categoryId: skill.categoryId,
				iconIds
			},
			categories,
			icons,
			isEdit: true
		};
	}

	return {
		skill: {
			skillId: '',
			title: '',
			categoryId: '',
			iconIds: []
		},
		categories,
		icons,
		isEdit: false
	};
};

export const actions: Actions = {
	saveData: async (event) => {
		const formData = await event.request.formData();
		const id = formData.get('id') as string | undefined;
		const iconIds = formData.getAll('iconIds') as string[];

		const parsed = skillSchema.safeParse(Object.fromEntries(formData));
		if (!parsed.success) {
			const errors = parsed.error.issues.map((err) => ({
				field: err.path[0],
				message: err.message
			}));
			return fail(400, { error: true, errors });
		}

		const data: UpdateSkills = {
			title: parsed.data.title,
			category_id: parsed.data.category_id,
			updatedAt: new Date(),
			iconIds
		};

		const response = id
			? await skillService.updateSkillService(event, data, id)
			: await skillService.createSkillService(event, { ...data, createdAt: new Date() });

		if (response.status !== 200) return response;

		throw redirect(302, '/dashboard/skill');
	}
};