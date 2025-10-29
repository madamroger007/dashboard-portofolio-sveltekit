import jwt, { type JwtPayload } from 'jsonwebtoken';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

/**
 * Middleware proteksi JWT untuk API route.
 * Gunakan di +server.ts seperti:
 * const payload = await jwtProtect(event.request);
 */
export async function jwtProtect(request: Request): Promise<JwtPayload> {
	const authHeader = request.headers.get('authorization');

	// 1️⃣ Cek apakah header ada dan valid
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		throw error(401, 'Unauthorized: Missing or invalid Authorization header');
	}

	// 2️⃣ Ambil token setelah "Bearer "
	const token = authHeader.split(' ')[1];

	// 3️⃣ Pastikan secret tersedia
	const JWT_SECRET = env.JWT_SECRET;
	if (!JWT_SECRET) {
		console.error('JWT_SECRET is missing in environment variables');
		throw error(500, 'Server misconfiguration');
	}

	try {
		// 4️⃣ Verifikasi token
		const decoded = jwt.verify(token, JWT_SECRET);

		// 5️⃣ Pastikan payload berbentuk objek
		if (typeof decoded !== 'object' || decoded === null) {
			throw error(403, 'Forbidden: Invalid token payload');
		}

		return decoded as JwtPayload;
	} catch (err) {
		console.error('JWT invalid:', err);
		throw error(403, 'Forbidden: Invalid or expired token');
	}
}
