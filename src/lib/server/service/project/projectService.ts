import { fail, type RequestEvent } from '@sveltejs/kit';
import generateId from '$lib/utils/generateId';
import {
	createProjectRepository,
	deleteProjectRepository,
	updateProjectRepository,
	addProjectIconsRepository,
	updateProjectIconsRepository
} from '$lib/server/repositories/project/projectRepository';
import type { CreateProject, UpdateProject } from '$lib/types/schema';

/**
 * ✅ Utility untuk membuat response standar sukses/gagal
 */
function makeResponse(success: boolean, message: string, status = 200) {
	return { success, status, message };
}

/**
 * ✅ Validasi minimal data sebelum kirim ke repository
 */
function validateProjectData(data: Partial<CreateProject | UpdateProject>) {
	if (!data.title?.trim()) throw new Error('Project title is required');
	if (!data.category_id?.trim()) throw new Error('Category ID is required');
	if (!data.description?.trim()) throw new Error('Description is required');
}

/**
 * ✅ Create new Project + optional icon relation
 */
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

		// 🔹 Tambahkan icon baru (tanpa hapus relasi apapun)
		if (Array.isArray(iconIds) && iconIds.length > 0) {
			await addProjectIconsRepository(projectId, iconIds);
		}

		return makeResponse(true, 'Project created successfully');
	} catch (err) {
		console.error('❌ Create Project Error:', err);
		return fail(500, { message: err instanceof Error ? err.message : 'An error occurred' });
	}
}

/**
 * ✅ Update existing Project + refresh icon relation
 */
export async function updateProjectService(event: RequestEvent, data: UpdateProject, id: string) {
	try {
		if (!id) throw new Error('Project ID is required');

		const { iconIds = [], ...projectData } = data;

		validateProjectData(projectData);

		await updateProjectRepository(id, projectData);

		// 🔹 Tambahkan icon baru tanpa menghapus yang sudah ada
		if (Array.isArray(iconIds)) {
			await updateProjectIconsRepository(id, iconIds);
		}

		return makeResponse(true, 'Project updated successfully');
	} catch (err) {
		console.error('❌ Update Project Error:', err);
		return fail(500, { message: err instanceof Error ? err.message : 'An error occurred' });
	}
}

/**
 * ✅ Delete Project + otomatis hapus relasi cascade
 */
export async function deleteProjectService(event: RequestEvent, id: string) {
	try {
		if (!id) throw new Error('Project ID is required');
		await deleteProjectRepository(id);

		return makeResponse(true, 'Project deleted successfully');
	} catch (err) {
		console.error('❌ Delete Project Error:', err);
		return fail(500, { message: err instanceof Error ? err.message : 'An error occurred' });
	}
}
