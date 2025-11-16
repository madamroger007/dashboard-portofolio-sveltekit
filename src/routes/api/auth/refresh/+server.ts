// src/routes/api/auth/refresh/+server.ts
import { json, error } from '@sveltejs/kit';
import { refreshAccessTokenService } from '$lib/server/service/tokenService';

export async function POST({ cookies }) {
  const refreshToken = cookies.get('refresh_token');

  if (!refreshToken) throw error(401, 'Missing refresh token');

  try {
    const { accessToken } = await refreshAccessTokenService(refreshToken);

    // kirimkan token baru ke client
    return json(
      {
        success: true,
        message: 'Access token refreshed successfully',
        accessToken,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return json(
      {
        success: false,
        message: err?.message || 'Failed to refresh token',
      },
      { status: err?.status || 403 }
    );
  }
}
