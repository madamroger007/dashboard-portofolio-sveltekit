import { jwtProtect } from '$lib/hooks/jwtProtect';
import { json } from '@sveltejs/kit';
import { getAllSkillsService } from '$lib/server/service/skill/skillService.js';

export async function GET({ request }) {
    try {
        await jwtProtect(request);
        const skills = await getAllSkillsService();

        return json(
            {
                status: 200,
                success: true,
                message: 'Skills data retrieved successfully',
                data: skills,
            }
        );
    } catch (err: any) {
        return json(
            {
                status: err?.status || 500,
                success: false,
                message: err?.message || 'Failed to fetch skills data',
                ...(process.env.NODE_ENV === 'development' && { error: err }),
            }
        );
    }
}
