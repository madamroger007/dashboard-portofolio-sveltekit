// src/lib/server/services/jwtService.ts
import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken';
import { error } from '@sveltejs/kit';
import {
    getTokenUsersByAccessTokenRepository
    , getTokenUsersByUserIdRepository, addTokenUsersRepository, getTokenUsersByTokenRepository, updateTokenUsersRepository, revokeTokenRepositoryByAccessToken, getTokenUsersByRefreshTokenRepository
} from '$lib/server/repositories/tokenRepository';
import { fail, type RequestEvent } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import crypto from "crypto";
import generateId from '$lib/utils/generateId';

const ACCESS_EXPIRES_IN = '1h';
const ACCESS_EXPIRES_MS = 60 * 60 * 1000; // 1 jam
const REFRESH_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000; // 7 hari

export function signAccessToken(payload: Record<string, unknown>): string {
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: ACCESS_EXPIRES_IN });
}

export async function verifyAccessToken(accessToken: string): Promise<JwtPayload> {
    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET as string) as JwtPayload;

        const dbRecord = await getTokenUsersByAccessTokenRepository(accessToken);
        if (!dbRecord) throw error(403, 'Token not found or revoked');

        if (new Date(dbRecord.expiresAt) <= new Date()) {
            throw error(403, 'Access token expired');
        }

        return decoded;
    } catch {
        throw error(403, 'Invalid or expired token');
    }
}

export async function createTokenService(event: RequestEvent, userId: string) {
    try {
        const existing = await getTokenUsersByUserIdRepository(userId);
        if (existing) return fail(400, { message: 'Token limit reached' });

        const { apiToken, hashedToken } = await generateUniqueSecureToken();
        const now = Date.now();

        const accessToken = signAccessToken({ sub: userId, th: hashedToken });
        const refreshToken = crypto.randomBytes(64).toString('base64url');

        await addTokenUsersRepository({
            id: generateId(),
            userId,
            token: hashedToken,
            accessToken,
            refreshToken,
            expiresAt: new Date(now + ACCESS_EXPIRES_MS),
            refreshExpiresAt: new Date(now + REFRESH_EXPIRES_MS),
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return {
            success: true,
            status: 200,
            message: 'Token created successfully'
        };
    } catch (err) {
        console.error(err);
        return fail(500, { message: 'Error creating token' });
    }
}

export async function refreshAccessTokenService(refreshToken: string) {
    const record = await getTokenUsersByRefreshTokenRepository(refreshToken);
    if (!record) throw error(403, 'Invalid refresh token');

    if (new Date(record.refreshExpiresAt) <= new Date()) {
        throw error(403, 'Refresh token expired');
    }

    const newAccessToken = signAccessToken({ sub: record.userId, th: record.token });

    await updateTokenUsersRepository(record.userId, {
        accessToken: newAccessToken,
        expiresAt: new Date(Date.now() + ACCESS_EXPIRES_MS),
        updatedAt: new Date(),
    });

    return {
        accessToken: newAccessToken,
        expiresAt: new Date(Date.now() + ACCESS_EXPIRES_MS),
    };
}

export async function updateTokenService(event: RequestEvent, userId: string) {
    try {
        const { apiToken, hashedToken } = await generateUniqueSecureToken();
        const now = Date.now();

        const accessToken = signAccessToken({ sub: userId, th: hashedToken });
        const refreshToken = crypto.randomBytes(64).toString('base64url');

        await updateTokenUsersRepository(userId, {
            token: hashedToken,
            accessToken,
            refreshToken,
            expiresAt: new Date(now + ACCESS_EXPIRES_MS),
            refreshExpiresAt: new Date(now + REFRESH_EXPIRES_MS),
            updatedAt: new Date(),
        });

        return {
            success: true,
            status: 200,
            message: 'Token updated successfully',
        };
    } catch (err) {
        console.error(err);
        return fail(500, { message: 'Error updating token' });
    }
}

export async function revokeTokenService(accessToken: string) {
    try {
        await revokeTokenRepositoryByAccessToken(accessToken);
        return { success: true, message: 'Token revoked' };
    } catch (err) {
        console.error(err);
        throw error(500, 'Failed to revoke token');
    }
}

export async function getTokenByUserIdService(id: string) {
    try {
        const token = await getTokenUsersByUserIdRepository(id);
        return token;
    } catch (error) {
        return fail(500, { message: error instanceof Error ? error.message : 'An error occurred' });
    }
}



async function generateUniqueSecureToken(): Promise<{ apiToken: string; hashedToken: string }> {
    let apiToken: string;
    let hashedToken: string;
    let existing: any;

    do {
        apiToken = auth.generateApiToken();
        const digest = crypto.createHash('sha256').update(apiToken).digest();
        hashedToken = Buffer.from(digest).toString('base64url');
        existing = await getTokenUsersByTokenRepository(hashedToken);
    } while (existing);

    return { apiToken, hashedToken };
}