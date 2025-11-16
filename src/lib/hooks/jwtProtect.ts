import { error } from '@sveltejs/kit';
import { verifyAccessToken, refreshAccessTokenService } from '$lib/server/service/tokenService';

export async function jwtProtect(request: Request) {
  const app_token = request.headers.get('x-app-token');

  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ') || !app_token || app_token !== process.env.APP_API_TOKEN) {
    throw error(401, 'Unauthorized: Missing or invalid Authorization header');
  }


  const accessToken = authHeader.split(' ')[1];

  try {
    const payload = await verifyAccessToken(accessToken);
    if (!payload || !payload.sub) throw error(403, 'Invalid token payload');

    return { payload };
  } catch (err: any) {
    throw error(403, 'Invalid token');
  }
}
