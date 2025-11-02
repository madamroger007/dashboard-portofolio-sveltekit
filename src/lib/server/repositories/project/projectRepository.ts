import { db } from '$lib/server/db/client';
import {
    projects,
    project_icons,
    category_project,
    type Project
} from '$lib/server/db/schema_project';
import { icons } from '$lib/server/db/schema_icons';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { getCache, setCache, delCache } from '$lib/server/repositories/redisRepository';

/* ---------------------------- MAPPING HELPER ----------------------------- */
export type MapProjects = {
    projectId: string;
    title: string;
    url: string;
    publicId: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    categoryId: string | null;
    categoryTitle?: string | null;
    categorySubtitle?: string | null;
    iconId?: string | null;
    iconName?: string | null;
    iconUrl?: string | null;
};

export type ProjectIcon = {
    id: string;
    name: string;
    url: string;
};

export type ProjectWithIcons = {
    id: string;
    title: string;
    url: string;
    publicId: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    category: {
        id: string | null;
        title: string | null;
        subtitle?: string | null;
    } | null;
    icons: ProjectIcon[];
};

export type ProjectWithIconsList = ProjectWithIcons[];

/* ---------------------------- MAPPING FUNCTION ---------------------------- */
function mapProjects(rows: MapProjects[]) {
    const map = new Map<string, ProjectWithIcons>();

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
                    ? { id: r.categoryId, title: r.categoryTitle ?? null, subtitle: r.categorySubtitle }
                    : null,
                icons: []
            });
        }

        if (r.iconId) {
            map.get(r.projectId)?.icons.push({
                id: r.iconId,
                name: r.iconName || '',
                url: r.iconUrl || ''
            });
        }
    });

    return Array.from(map.values());
}

/* ---------------------------- CREATE PROJECT ---------------------------- */
export async function createProjectRepository(data: Project) {
    await db.insert(projects).values(data);
    await delCache('projects:*'); // invalidate all project cache
}

/* ---------------------------- UPDATE PROJECT ---------------------------- */
export async function updateProjectRepository(id: string, data: Partial<Project>) {
    await db.update(projects).set(data).where(eq(projects.id, id));
    await delCache(`projects:${id}`);
    await delCache('projects:all');
}

/* ---------------------------- DELETE PROJECT ---------------------------- */
export async function deleteProjectRepository(id: string) {
    await db.delete(projects).where(eq(projects.id, id));
    await delCache(`projects:${id}`);
    await delCache('projects:all');
}

/* ---------------------------- SET PROJECT ICONS --------------------------- */
export async function addProjectIconsRepository(projectId: string, iconIds: string[]) {
    if (iconIds.length === 0) return;

    const existing = await db
        .select({ icon_id: project_icons.icon_id })
        .from(project_icons)
        .where(eq(project_icons.project_id, projectId));

    const existingIds = existing.map((e) => e.icon_id);
    const newIcons = iconIds.filter((id) => !existingIds.includes(id));

    if (newIcons.length > 0) {
        await db.insert(project_icons).values(
            newIcons.map((iconId) => ({
                project_id: projectId,
                icon_id: iconId
            }))
        );
        await delCache(`projects:${projectId}`);
        await delCache('projects:all');
    }
}

export async function updateProjectIconsRepository(projectId: string, iconIds: string[]) {
    const existing = await db
        .select({ icon_id: project_icons.icon_id })
        .from(project_icons)
        .where(eq(project_icons.project_id, projectId));

    const existingIds = existing.map((e) => e.icon_id);

    const toAdd = iconIds.filter((id) => !existingIds.includes(id));
    const toRemove = existingIds.filter((id) => !iconIds.includes(id));

    if (toRemove.length > 0) {
        await db
            .delete(project_icons)
            .where(
                and(
                    eq(project_icons.project_id, projectId),
                    inArray(project_icons.icon_id, toRemove)
                )
            );
    }

    if (toAdd.length > 0) {
        await db.insert(project_icons).values(
            toAdd.map((iconId) => ({
                project_id: projectId,
                icon_id: iconId
            }))
        );
    }

    await delCache(`projects:${projectId}`);
    await delCache('projects:all');
}

/* ---------------------------- GET ALL PROJECTS ---------------------------- */
export async function getAllProjectRepository(): Promise<ProjectWithIconsList> {
    const cacheKey = 'projects:all';
    const cached = await getCache<ProjectWithIconsList>(cacheKey);
    if (cached) return cached;

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
            iconId: icons.id,
            iconName: icons.name,
            iconUrl: icons.url
        })
        .from(projects)
        .leftJoin(category_project, eq(projects.category_id, category_project.id))
        .leftJoin(project_icons, eq(projects.id, project_icons.project_id))
        .leftJoin(icons, eq(project_icons.icon_id, icons.id))
        .orderBy(desc(projects.createdAt));

    const result = mapProjects(rows);
    await setCache(cacheKey, result);
    return result;
}

/* ---------------------------- GET PROJECT BY ID ---------------------------- */
export async function getProjectByIdRepository(id: string): Promise<ProjectWithIcons | undefined> {
    const cacheKey = `projects:${id}`;
    const cached = await getCache<ProjectWithIcons>(cacheKey);
    if (cached) return cached;

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
            iconId: icons.id,
            iconName: icons.name,
            iconUrl: icons.url
        })
        .from(projects)
        .leftJoin(category_project, eq(projects.category_id, category_project.id))
        .leftJoin(project_icons, eq(projects.id, project_icons.project_id))
        .leftJoin(icons, eq(project_icons.icon_id, icons.id))
        .where(eq(projects.id, id));

    const result = rows.length ? mapProjects(rows)[0] : undefined;
    if (result) await setCache(cacheKey, result);
    return result;
}
