import { jwtProtect } from '$lib/hooks/jwtProtect';
import { json } from '@sveltejs/kit';
import { getAllProjectService } from '$lib/server/service/project/projectService.js';

export async function GET({ request }) {
    try {
        await jwtProtect(request);
        const projects = await getAllProjectService();

        return json(
            {
                status: 200,
                success: true,
                message: 'Projects data retrieved successfully',
                data: projects,
            }
        );
    } catch (err: any) {
        return json(
            {
                status: err?.status || 500,
                success: false,
                message: err?.message || 'Failed to fetch projects data',
                ...(process.env.NODE_ENV === 'development' && { error: err }),
            }
        );
    }
}
