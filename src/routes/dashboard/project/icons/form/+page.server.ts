import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import * as iconsProjectService from '$lib/server/service/project/iconsProjectService';
import * as iconsProjectRepository from '$lib/server/repositories/project/iconsProjectRepository';
import { projectIconSchema } from '$lib/validation/project-schema';
import type { UpdateProjectIcon } from '$lib/types/schema';
import { uploadOrKeepImage } from '$lib/utils/fileManagement';

export const load: PageServerLoad = async ({ url }) => {
	const id = url.searchParams.get('id');
	if (!id) {
		return { iconProjects: { id: '', name: '', url: '', publicId: '' }, isEdit: false };
	}

	const icon = await iconsProjectRepository.getIconProjectByIdRepository(id);
	if (!icon) throw redirect(404, '/dashboard/project/icons');

	return { iconProjects: icon, isEdit: true };
};

export const actions: Actions = {
	saveData: async (event) => {
		const form = await event.request.formData();
		const id = form.get('id') as string | undefined;
		const name = form.get('name') as string;
		const publicId = form.get('publicId') as string;
		const file = form.get('image') as File | null;
		const parsed = projectIconSchema.safeParse({ name, file });
		if (!parsed.success) {
			const errors = parsed.error.issues.map((err) => ({
				field: err.path[0],
				message: err.message
			}));
			return fail(400, { error: true, errors });
		}

		const existing = id
			? await iconsProjectRepository.getIconProjectByIdRepository(id)
			: undefined;

		const { url, publicId: finalPublicId } = await uploadOrKeepImage(file, publicId, existing);

		const data: UpdateProjectIcon = {
			name: parsed.data.name,
			publicId: finalPublicId,
			url: url,
			updatedAt: new Date()
		};

		const response = id
			? await iconsProjectService.updateIconProjectService(event, data, id)
			: await iconsProjectService.createIconProjectService(event, {
				...data,
				createdAt: new Date()
			});

		if (response.status !== 200) {
			return response;
		}

		throw redirect(302, '/dashboard/project/icons');
	}
};
