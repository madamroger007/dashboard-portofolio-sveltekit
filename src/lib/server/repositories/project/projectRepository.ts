import { db } from '$lib/server/db/client';
import {
    projects,
    project_project_icon,
    project_icon,
    category_project,
    type Project
} from '$lib/server/db/schema_project';
import { and, desc, eq, inArray } from 'drizzle-orm';

/* ---------------------------- CREATE PROJECT ---------------------------- */
export async function createProjectRepository(data: Project) {
    await db.insert(projects).values(data);
}

/* ---------------------------- UPDATE PROJECT ---------------------------- */
export async function updateProjectRepository(id: string, data: Partial<Project>) {
    await db.update(projects).set(data).where(eq(projects.id, id));
}

/* ---------------------------- DELETE PROJECT ---------------------------- */
export async function deleteProjectRepository(id: string) {
    await db.delete(projects).where(eq(projects.id, id));
}

/* ---------------------------- SET PROJECT ICONS --------------------------- */
export async function addProjectIconsRepository(projectId: string, iconIds: string[]) {
    if (iconIds.length === 0) return;

    // Ambil semua relasi yang sudah ada
    const existing = await db
        .select({ icon_id: project_project_icon.icon_id })
        .from(project_project_icon)
        .where(eq(project_project_icon.project_id, projectId));

    const existingIds = existing.map((e) => e.icon_id);

    // Filter hanya yang belum ada
    const newIcons = iconIds.filter((id) => !existingIds.includes(id));

    // Insert hanya icon baru
    if (newIcons.length > 0) {
        await db.insert(project_project_icon).values(
            newIcons.map((iconId) => ({
                project_id: projectId,
                icon_id: iconId
            }))
        );
    }
}

export async function updateProjectIconsRepository(projectId: string, iconIds: string[]) {
	// Ambil semua relasi lama
	const existing = await db
		.select({ icon_id: project_project_icon.icon_id })
		.from(project_project_icon)
		.where(eq(project_project_icon.project_id, projectId));

	const existingIds = existing.map((e) => e.icon_id);

	// Hitung yang perlu ditambah dan dihapus
	const toAdd = iconIds.filter((id) => !existingIds.includes(id));
	const toRemove = existingIds.filter((id) => !iconIds.includes(id));

	// Hapus relasi yang tidak lagi dipilih
	if (toRemove.length > 0) {
		await db
			.delete(project_project_icon)
			.where(
				and(
					eq(project_project_icon.project_id, projectId),
					inArray(project_project_icon.icon_id, toRemove)
				)
			);
	}

	// Tambahkan relasi baru
	if (toAdd.length > 0) {
		await db.insert(project_project_icon).values(
			toAdd.map((iconId) => ({
				project_id: projectId,
				icon_id: iconId
			}))
		);
	}
}

/* ---------------------------- MAPPING HELPER ----------------------------- */
function mapProjects(rows: any[]) {
    const map = new Map<string, any>();

    rows.forEach((r) => {
        if (!map.has(r.projectId)) {
            map.set(r.projectId, {
                id: r.projectId,
                title: r.title,
                url: r.url,
                publicId: r.publicId,
                description: r.description,
                createdAt: r.createdAt,
                updatedAt: r.updatedAt,
                category: r.categoryId
                    ? { id: r.categoryId, title: r.categoryTitle, sub_title: r.categorySubtitle }
                    : null,
                icons: []
            });
        }
        if (r.iconId) {
            map.get(r.projectId).icons.push({
                id: r.iconId,
                name: r.iconName,
                url: r.iconUrl
            });
        }
    });

    return Array.from(map.values());
}

/* ---------------------------- GET ALL PROJECTS ---------------------------- */
export async function getAllProjectRepository() {
    const rows = await db
        .select({
            projectId: projects.id,
            title: projects.title,
            publicId: projects.publicId,
            url: projects.url,
            description: projects.description,
            createdAt: projects.createdAt,
            updatedAt: projects.updatedAt,
            categoryId: category_project.id,
            categoryTitle: category_project.title,
            categorySubtitle: category_project.sub_title,
            iconId: project_icon.id,
            iconName: project_icon.name,
            iconUrl: project_icon.url
        })
        .from(projects)
        .leftJoin(category_project, eq(projects.category_id, category_project.id))
        .leftJoin(project_project_icon, eq(projects.id, project_project_icon.project_id))
        .leftJoin(project_icon, eq(project_project_icon.icon_id, project_icon.id))
        .orderBy(desc(projects.createdAt));

    return mapProjects(rows);
}

/* ---------------------------- GET PROJECT BY ID ---------------------------- */
export async function getProjectByIdRepository(id: string) {
    const rows = await db
        .select({
            projectId: projects.id,
            title: projects.title,
            publicId: projects.publicId,
            url: projects.url,
            description: projects.description,
            createdAt: projects.createdAt,
            updatedAt: projects.updatedAt,
            categoryId: category_project.id,
            iconId: project_icon.id
        })
        .from(projects)
        .leftJoin(category_project, eq(projects.category_id, category_project.id))
        .leftJoin(project_project_icon, eq(projects.id, project_project_icon.project_id))
        .leftJoin(project_icon, eq(project_project_icon.icon_id, project_icon.id))
        .where(eq(projects.id, id));

    return rows.length ? mapProjects(rows)[0] : undefined;
}
