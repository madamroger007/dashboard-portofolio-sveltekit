import { fail, type RequestEvent } from '@sveltejs/kit';
import generateId from '$lib/utils/generateId';
import {
	createProjectRepository,
	deleteProjectRepository,
	updateProjectRepository,
	addProjectIconsRepository,
	updateProjectIconsRepository,
	getProjectByIdRepository,
	getAllProjectRepository
} from '$lib/server/repositories/project/projectRepository';
import type { CreateProject, UpdateProject } from '$lib/types/schema';


function validateProjectData(data: Partial<CreateProject | UpdateProject>) {
	if (!data.title?.trim()) throw new Error('Project title is required');
	if (!data.category_id?.trim()) throw new Error('Category ID is required');
	if (!data.description?.trim()) throw new Error('Description is required');
}

export async function createProjectService(event: RequestEvent, data: CreateProject) {
	const projectId = generateId();

	try {
		const { iconIds = [], ...projectData } = data;

		validateProjectData(projectData);

		await createProjectRepository({
			...projectData,
			id: projectId,
			updatedAt: new Date()
		});

		if (Array.isArray(iconIds) && iconIds.length > 0) {
			await addProjectIconsRepository(projectId, iconIds);
		}

		return { success: true, message: 'Project created successfully', status: 200 };
	} catch (error) {
		return fail(500, { message: error instanceof Error ? error.message : 'An error occurred' });
	}
}

export async function updateProjectService(event: RequestEvent, data: UpdateProject, id: string) {
	try {
		if (!id) throw new Error('Project ID is required');

		const { iconIds = [], ...projectData } = data;

		validateProjectData(projectData);

		await updateProjectRepository(id, projectData);

		if (Array.isArray(iconIds)) {
			await updateProjectIconsRepository(id, iconIds);
		}

		return { success: true, message: 'Project updated successfully', status: 200 };
	} catch (error) {
		return fail(500, { message: error instanceof Error ? error.message : 'An error occurred' });
	}
}

export async function deleteProjectService(event: RequestEvent, id: string) {
	try {
		if (!id) throw new Error('Project ID is required');
		const { publicId } = await getProjectByIdRepository(id);
		if (publicId) {
			const { cloudinaryService } = await import('$lib/server/service/cloudinaryService');
			await cloudinaryService.deleteImage(publicId);
		}
		await deleteProjectRepository(id);
		return { success: true, message: 'Project deleted successfully', status: 200 };
	} catch (error) {
		return fail(500, { message: error instanceof Error ? error.message : 'An error occurred' });
	}
}

export async function getAllProjectService() {
	try {
		const result = await getAllProjectRepository();
		return result;
	} catch (error) {
		return fail(500, { message: error instanceof Error ? error.message : 'An error occurred' });
	}
}

export async function getProjectByIdService(id: string) {
	try {
		const result = await getProjectByIdRepository(id);
		return result;
	} catch (error) {
		return fail(500, { message: error instanceof Error ? error.message : 'An error occurred' });
	}
}