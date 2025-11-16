import { jwtProtect } from '$lib/hooks/jwtProtect';
import { json } from '@sveltejs/kit';
import { getCertifAllService } from '$lib/server/service/certifService.js';

export async function GET({ request }) {
  try {
    await jwtProtect(request);
    const certification = await getCertifAllService();

    return json(
      {
        status: 200,
        success: true,
        message: 'Certification data retrieved successfully',
        data: certification,
      }
    );
  } catch (err: any) {
    return json(
      {
        status: err?.status || 500,
        success: false,
        message: err?.message || 'Failed to fetch certification data',
        ...(process.env.NODE_ENV === 'development' && { error: err }),
      }
    );
  }
}
