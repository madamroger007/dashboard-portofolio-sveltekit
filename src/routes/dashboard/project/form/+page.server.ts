import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import * as projectService from '$lib/server/service/project/projectService';
import * as projectRepository from '$lib/server/repositories/project/projectRepository';
import * as categoryProjectRepository from '$lib/server/repositories/project/categoryProjectRepository';
import * as iconRepository from '$lib/server/repositories/iconsRepository';
import { projectSchema } from '$lib/validation/project-schema';
import type { UpdateProject } from '$lib/types/schema';
import { uploadOrKeepImage } from '$lib/utils/fileManagement';


export const load: PageServerLoad = async ({ url }) => {
	const id = url.searchParams.get('id');

	const categories = await categoryProjectRepository.getAllCategoryProjectRepository();
	const icons = await iconRepository.getAllIconRepository();

	if (id) {
		const project = await projectRepository.getProjectByIdRepository(id);
		if (!project) {
			throw redirect(404, '/dashboard/project');
		}

		// Pastikan iconIds diambil dari relasi project.icons
		const iconIds = project.icons ? project.icons.map((icon: any) => icon.id) : [];
		return {
			project: {
				projectId: project.id,
				title: project.title,
				image: project.image,
				description: project.description,
				categoryId: project.categoryId,
				publicId: project.publicId,
				url: project.url,
				iconIds
			},
			categories,
			icons,
			isEdit: true
		};
	}

	return {
		project: {
			projectId: '',
			title: '',
			image: '',
			description: '',
			categoryId: '',
			publicId: '',
			url: '',
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
		const publicId = formData.get('publicId') as string;
		const file = formData.get('image') as File | null;

		// ✅ Validasi form
		const parsed = projectSchema.safeParse(Object.fromEntries(formData));
		if (!parsed.success) {
			const errors = parsed.error.issues.map((err) => ({
				field: err.path[0],
				message: err.message
			}));
			return fail(400, { error: true, errors });
		}

		// ✅ Ambil data lama kalau edit
		const existing = id ? await projectRepository.getProjectByIdRepository(id) : undefined;

		// ✅ Upload / keep image
		const { url, publicId: finalPublicId } = await uploadOrKeepImage(file, publicId, existing);

		// ✅ Gabungkan iconIds ke data
		const data: UpdateProject = {
			title: parsed.data.title,
			description: parsed.data.description,
			url,
			publicId: finalPublicId,
			category_id: parsed.data.category_id,
			updatedAt: new Date(),
			iconIds // 👈 penting
		};

		// ✅ Jalankan service
		const response = id
			? await projectService.updateProjectService(event, data, id)
			: await projectService.createProjectService(event, { ...data, createdAt: new Date() });

		if (response.status !== 200) return response;

		throw redirect(302, '/dashboard/project');
	}
};