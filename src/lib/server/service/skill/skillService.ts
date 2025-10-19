import { fail, type RequestEvent } from '@sveltejs/kit';
import generateId from '$lib/utils/generateId';
import {
    createSkillRepository,
    deleteSkillRepository,
    updateSkillRepository,
    updateSkillIconsRepository,
    addSkillIconsRepository

} from '$lib/server/repositories/skill/skillRepository';
import type { CreateSkills, UpdateSkills } from '$lib/types/schema';


function validateSkillData(data: Partial<CreateSkills | UpdateSkills>) {
    if (!data.title?.trim()) throw new Error('Skill title is required');
    if (!data.category_id?.trim()) throw new Error('Category ID is required');
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
        if (!id) throw new Error('Skill ID is required');

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
        if (!id) throw new Error('Skill ID is required');
        await deleteSkillRepository(id);
        return { success: true, message: 'Skill deleted successfully', status: 200 };
    } catch (err) {
        return fail(500, { message: err instanceof Error ? err.message : 'An error occurred' });
    }
}
