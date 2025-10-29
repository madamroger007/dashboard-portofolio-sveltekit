import jwt from 'jsonwebtoken';
import type { JwtPayload, SignOptions, Secret } from 'jsonwebtoken';
import { env } from '$env/dynamic/private';

export function signToken(
	payload: Record<string, unknown> = {},
	expiresIn: SignOptions['expiresIn'] = '1h'
): string {
	const secret: Secret = env.JWT_SECRET;
	if (!secret) throw new Error('JWT_SECRET not found in environment variable');

	return jwt.sign(payload, secret, { expiresIn });
}


export function verifyToken(token: string): JwtPayload | null {
	try {
		const secret: Secret = env.JWT_SECRET;
		if (!secret) throw new Error('JWT_SECRET not found in environment variable');

		const decoded = jwt.verify(token, secret);
		return typeof decoded === 'object' ? (decoded as JwtPayload) : null;
	} catch {
		return null;
	}
}
