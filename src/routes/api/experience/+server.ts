import { jwtProtect } from '$lib/hooks/jwtProtect';
import { json } from '@sveltejs/kit';
import { getAllExperienceService } from '$lib/server/service/experience/experientService.js';

export async function GET({ request }) {
    try {
        await jwtProtect(request);
        const experience = await getAllExperienceService();

        return json(
            {
                status: 200,
                success: true,
                message: 'Experience data retrieved successfully',
                data: experience,
            }
        );
    } catch (err: any) {
        return json(
            {
                status: err?.status || 500,
                success: false,
                message: err?.message || 'Failed to fetch experience data',
                ...(process.env.NODE_ENV === 'development' && { error: err }),
            }
        );
    }
}
