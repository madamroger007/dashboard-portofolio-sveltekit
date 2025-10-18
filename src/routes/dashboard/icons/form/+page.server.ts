import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import * as iconsService from '$lib/server/service/iconsService';
import * as iconsRepository from '$lib/server/repositories/iconsRepository';
import { IconSchema } from '$lib/validation/icon-schema';
import type { UpdateIcon } from '$lib/types/schema';
import { uploadOrKeepImage } from '$lib/utils/fileManagement';

export const load: PageServerLoad = async ({ url }) => {
	const id = url.searchParams.get('id');
	if (!id) {
		return { iconProjects: { id: '', name: '', url: '', publicId: '' }, isEdit: false };
	}

	const icon = await iconsRepository.getIconByIdRepository(id);
	if (!icon) throw redirect(404, '/dashboard/icons');

	return { iconProjects: icon, isEdit: true };
};

export const actions: Actions = {
	saveData: async (event) => {
		const form = await event.request.formData();
		const id = form.get('id') as string | undefined;
		const name = form.get('name') as string;
		const publicId = form.get('publicId') as string;
		const file = form.get('image') as File | null;
		const parsed = IconSchema.safeParse({ name, file });
		if (!parsed.success) {
			const errors = parsed.error.issues.map((err) => ({
				field: err.path[0],
				message: err.message
			}));
			return fail(400, { error: true, errors });
		}

		const existing = id
			? await iconsRepository.getIconByIdRepository(id)
			: undefined;

		const { url, publicId: finalPublicId } = await uploadOrKeepImage(file, publicId, existing);

		const data: UpdateIcon = {
			name: parsed.data.name,
			publicId: finalPublicId,
			url: url,
			updatedAt: new Date()
		};

		const response = id
			? await iconsService.updateIconService(event, data, id)
			: await iconsService.createIconService(event, {
				...data,
				createdAt: new Date()
			});

		if (response.status !== 200) {
			return response;
		}

		throw redirect(302, '/dashboard/icons');
	}
};
