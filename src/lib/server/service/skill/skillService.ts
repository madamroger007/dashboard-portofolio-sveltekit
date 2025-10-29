import { fail, type RequestEvent } from '@sveltejs/kit';
import generateId from '$lib/utils/generateId';
import {
    createSkillRepository,
    deleteSkillRepository,
    updateSkillRepository,
    updateSkillIconsRepository,
    addSkillIconsRepository,
    getAllSkillsRepository,
    getSkillByIdRepository

} from '$lib/server/repositories/skill/skillRepository';
import type { CreateSkills, UpdateSkills } from '$lib/types/schema';

function validateSkillData(data: Partial<CreateSkills | UpdateSkills>) {
    if (!data.title?.trim()) return fail(400, { message: 'Title is required' });
    if (!data.category_id?.trim()) return fail(400, { message: 'Category ID is required' });
}

export async function getAllSkillsService() {
    try {
        const data = await getAllSkillsRepository();
        return data;
    } catch (err) {
        return fail(500, { message: err instanceof Error ? err.message : 'An error occurred' });
    }
}

export async function getSkillByIdService(id: string) {
    try {
        const data = await getSkillByIdRepository(id);
        return data;
    } catch (err) {
        return fail(500, { message: err instanceof Error ? err.message : 'An error occurred' });
    }
}

export async function createSkillService(event: RequestEvent, data: CreateSkills) {
    const skillId = generateId();

    try {
        const { iconIds = [], ...skillData } = data;

        validateSkillData(skillData);

        await createSkillRepository({
            ...skillData,
            id: skillId,
            updatedAt: new Date()
        });

        if (Array.isArray(iconIds) && iconIds.length > 0) {
            await addSkillIconsRepository(skillId, iconIds);
        }

        return { success: true, message: 'Skill created successfully', status: 200 };
    } catch (err) {
        return fail(500, { message: err instanceof Error ? err.message : 'An error occurred' });
    }
}

export async function updateSkillService(event: RequestEvent, data: UpdateSkills, id: string) {
    try {
        if (!id) return fail(400, { message: 'Skill ID is required' });

        const { iconIds = [], ...skillData } = data;

        validateSkillData(skillData);

        await updateSkillRepository(id, skillData);

        if (Array.isArray(iconIds)) {
            await updateSkillIconsRepository(id, iconIds);
        }

        return { success: true, message: 'Skill updated successfully', status: 200 };
    } catch (err) {
        return fail(500, { message: err instanceof Error ? err.message : 'An error occurred' });
    }
}

export async function deleteSkillService(event: RequestEvent, id: string) {
    try {
        if (!id) return fail(400, { message: 'Skill ID is required' });
        await deleteSkillRepository(id);
        return { success: true, message: 'Skill deleted successfully', status: 200 };
    } catch (err) {
        return fail(500, { message: err instanceof Error ? err.message : 'An error occurred' });
    }
}

