import { jwtProtect } from '$lib/hooks/jwtProtect';
import { json } from '@sveltejs/kit';
import { getAllIconService } from '$lib/server/service/iconsService.js';

export async function GET({ request }) {
    try {
        await jwtProtect(request);
        const icons = await getAllIconService();

        return json(
            {
                status: 200,
                success: true,
                message: 'Icons data retrieved successfully',
                data: icons,
            }
        );
    } catch (err: any) {
        return json(
            {
                status: err?.status || 500,
                success: false,
                message: err?.message || 'Failed to fetch icons data',
                ...(process.env.NODE_ENV === 'development' && { error: err }),
            }
        );
    }
}
