import { db } from '$lib/server/db/client';
import {
    projects,
    project_project_icon,
    project_icon,
    category_project,
    type Project
} from '$lib/server/db/schema_project';
import { desc, eq } from 'drizzle-orm';

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
export async function setProjectIcons(projectId: string, iconIds: string[]) {
    // Hapus semua icon lama
    await db.delete(project_project_icon).where(eq(project_project_icon.project_id, projectId));

    // Insert baru
    if (iconIds.length > 0) {
        await db.insert(project_project_icon).values(
            iconIds.map((iconId) => ({
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
                image: r.image,
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
            image: projects.image,
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
            image: projects.image,
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
        .where(eq(projects.id, id));

    return rows.length ? mapProjects(rows)[0] : undefined;
}
