import { db } from '$lib/server/db/client';
import {
    skills,
    skill_icons,
    category_skill,
    type Skill
} from '$lib/server/db/schema_skill';
import { icons } from '$lib/server/db/schema_icons';
import { and, desc, eq, inArray } from 'drizzle-orm';

/* ---------------------------- MAPPING HELPER ----------------------------- */

export type MapSkills = {
    skillId: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    categoryId: string | null;
    categoryTitle?: string | null;
    categorySubtitle?: string | null;
    iconId?: string | null;
    iconName?: string | null;
    iconUrl?: string | null;
};

export type SkillIcon = {
    id: string;
    name: string;
    url: string;
};

export type SkillWithIcons = {
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
    };
    icons: SkillIcon[];
};

export type SkillWithIconsList = SkillWithIcons[];

/* ---------------------------- CREATE SKILL ---------------------------- */
export async function createSkillRepository(data: Skill) {
    await db.insert(skills).values(data);
}

/* ---------------------------- UPDATE SKILL ---------------------------- */
export async function updateSkillRepository(id: string, data: Partial<Skill>) {
    await db.update(skills).set(data).where(eq(skills.id, id));
}

/* ---------------------------- DELETE SKILL ---------------------------- */
export async function deleteSkillRepository(id: string) {
    await db.delete(skills).where(eq(skills.id, id));
}

/* ---------------------------- SET SKILL ICONS --------------------------- */
export async function addSkillIconsRepository(skillId: string, iconIds: string[]) {
    if (iconIds.length === 0) return;

    const existing = await db
        .select({ icon_id: skill_icons.icon_id })
        .from(skill_icons)
        .where(eq(skill_icons.skill_id, skillId));

    const existingIds = existing.map((e) => e.icon_id);

    const newIcons = iconIds.filter((id) => !existingIds.includes(id));

    if (newIcons.length > 0) {
        await db.insert(skill_icons).values(
            newIcons.map((iconId) => ({
                skill_id: skillId,
                icon_id: iconId
            }))
        );
    }
}

export async function updateSkillIconsRepository(skillId: string, iconIds: string[]) {

    const existing = await db
        .select({ icon_id: skill_icons.icon_id })
        .from(skill_icons)
        .where(eq(skill_icons.skill_id, skillId));

    const existingIds = existing.map((e) => e.icon_id);

    const toAdd = iconIds.filter((id) => !existingIds.includes(id));
    const toRemove = existingIds.filter((id) => !iconIds.includes(id));

    if (toRemove.length > 0) {
        await db
            .delete(skill_icons)
            .where(
                and(
                    eq(skill_icons.skill_id, skillId),
                    inArray(skill_icons.icon_id, toRemove)
                )
            );
    }

    if (toAdd.length > 0) {
        await db.insert(skill_icons).values(
            toAdd.map((iconId) => ({
                skill_id: skillId,
                icon_id: iconId
            }))
        );
    }
}

/* ---------------------------- MAPPING HELPER ----------------------------- */
function mapSkills(rows: MapSkills[]) {
    const map = new Map<string, any>();

    rows.forEach((r) => {
        if (!map.has(r.skillId)) {
            map.set(r.skillId, {
                id: r.skillId,
                title: r.title,
                createdAt: r.createdAt,
                updatedAt: r.updatedAt,
                category: r.categoryId
                    ? { id: r.categoryId, title: r.categoryTitle, sub_title: r.categorySubtitle }
                    : null,
                icons: []
            });
        }
        if (r.iconId) {
            map.get(r.skillId).icons.push({
                id: r.iconId,
                name: r.iconName,
                url: r.iconUrl
            });
        }
    });

    return Array.from(map.values());
}

/* ---------------------------- GET ALL SKILLS ---------------------------- */
export async function getAllSkillsRepository() {
    const rows = await db
        .select({
            skillId: skills.id,
            title: skills.title,
            createdAt: skills.createdAt,
            updatedAt: skills.updatedAt,
            categoryId: category_skill.id,
            categoryTitle: category_skill.title,
            iconId: icons.id,
            iconName: icons.name,
            iconUrl: icons.url
        })
        .from(skills)
        .leftJoin(category_skill, eq(skills.category_id, category_skill.id))
        .leftJoin(skill_icons, eq(skills.id, skill_icons.skill_id))
        .leftJoin(icons, eq(skill_icons.icon_id, icons.id))
        .orderBy(desc(skills.createdAt));

    return mapSkills(rows);
}

/* ---------------------------- GET SKILL BY ID ---------------------------- */
export async function getSkillByIdRepository(id: string) {
    const rows = await db
        .select({
            skillId: skills.id,
            title: skills.title,
            createdAt: skills.createdAt,
            updatedAt: skills.updatedAt,
            categoryId: category_skill.id,
            iconId: icons.id
        })
        .from(skills)
        .leftJoin(category_skill, eq(skills.category_id, category_skill.id))
        .leftJoin(skill_icons, eq(skills.id, skill_icons.skill_id))
        .leftJoin(icons, eq(skill_icons.icon_id, icons.id))
        .where(eq(skills.id, id));

    return rows.length ? mapSkills(rows)[0] : undefined;
}
