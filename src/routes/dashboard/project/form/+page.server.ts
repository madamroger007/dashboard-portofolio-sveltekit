import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import * as projectService from '$lib/server/service/project/projectService';
import * as categoryProjectService from '$lib/server/service/project/categoryProjectService';
import * as iconService from '$lib/server/service/iconsService';
import { projectSchema } from '$lib/validation/project-schema';
import type { UpdateProject } from '$lib/types/schema';
import { uploadOrKeepImage } from '$lib/utils/fileManagement';


export const load: PageServerLoad = async ({ url }) => {
	const id = url.searchParams.get('id');

	const categories = await categoryProjectService.getAllCategoryProjectService();
	const icons = await iconService.getAllIconService();

	if (id) {
		const project = await projectService.getProjectByIdService(id);
		console.log(project);
		if (!project) {
			throw redirect(404, '/dashboard/project');
		}

		const iconIds = project.icons ? project.icons.map((icon: any) => icon.id) : [];
		return {
			project: {
				projectId: project.id,
				title: project.title,
				image: project.url,
				description: project.description,
				categoryId: project.category?.id,
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

		const parsed = projectSchema.safeParse(Object.fromEntries(formData));
		if (!parsed.success) {
			const errors = parsed.error.issues.map((err) => ({
				field: err.path[0],
				message: err.message
			}));
			return fail(400, { error: true, errors });
		}

		const existing = id ? await projectService.getProjectByIdService(id) : undefined;


		const { url, publicId: finalPublicId } = await uploadOrKeepImage(file, publicId, existing);


		const data: UpdateProject = {
			title: parsed.data.title,
			description: parsed.data.description,
			url,
			publicId: finalPublicId,
			category_id: parsed.data.category_id,
			updatedAt: new Date(),
			iconIds
		};

		const response = id
			? await projectService.updateProjectService(event, data, id)
			: await projectService.createProjectService(event, { ...data, createdAt: new Date() });

		if (response.status !== 200) return response;

		throw redirect(302, '/dashboard/project');
	}
};