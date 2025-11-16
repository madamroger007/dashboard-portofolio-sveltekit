// src/lib/server/repositories/tokenRepository.ts
import { db } from '$lib/server/db/client';
import { token_users, type TokenUser } from '$lib/server/db/schemaAuth';
import { eq } from 'drizzle-orm';
import { getCache, setCache, delCache } from '$lib/server/repositories/redisRepository';
import { invalidateUserCache } from '$lib/server/repositories/userRepository';
const CACHE_TTL = 60 * 5;
/** ADD TOKEN USER */
export async function addTokenUsersRepository(data: TokenUser): Promise<void> {
    await db.insert(token_users).values(data);
    await invalidateUserCache(data.userId);
}

/** GET TOKEN BY USER ID */
export async function getTokenUsersByUserIdRepository(userId: string) {
    const cacheKey = `token:user:${userId}`;
    const cached = await getCache<any>(cacheKey);
    if (cached) return cached;

    const result = await db.query.token_users.findFirst({
        where: eq(token_users.userId, userId),
    });

    if (result) await setCache(cacheKey, result);
    return result;
}

/** GET TOKEN BY TOKEN VALUE */
export async function getTokenUsersByTokenRepository(token: string) {
    const cacheKey = `token:${token}`;
    const cached = await getCache<any>(cacheKey);
    if (cached) return cached;

    const result = await db.query.token_users.findFirst({
        where: eq(token_users.token, token),
    });

    if (result) await setCache(cacheKey, result);
    return result;
}

/** UPDATE TOKEN */
export async function updateTokenUsersRepository(id: string, data: Partial<TokenUser>): Promise<void> {
    await db.update(token_users).set(data).where(eq(token_users.userId, id));
    await invalidateUserCache(id);
}

export async function getTokenUsersByRefreshTokenRepository(refreshToken: string) {
    const cacheKey = `refresh:${refreshToken}`;
    const cached = await getCache<any>(cacheKey);
    if (cached) return cached;

    const result = await db.query.token_users.findFirst({
        where: eq(token_users.refreshToken, refreshToken),
    });

    if (result) await setCache(cacheKey, result, CACHE_TTL);
    return result;
}



export async function getTokenByValueRepository(token: string) {
    const cacheKey = `token:${token}`;
    const cached = await getCache<any>(cacheKey);
    if (cached) return cached;

    const result = await db.query.token_users.findFirst({
        where: eq(token_users.token, token),
    });

    if (result) await setCache(cacheKey, result);
    return result;
}

export async function getTokenUsersByAccessTokenRepository(accessToken: string) {
    const cacheKey = `access:${accessToken}`;
    const cached = await getCache<any>(cacheKey);
    if (cached) return cached;

    const result = await db.query.token_users.findFirst({
        where: eq(token_users.accessToken, accessToken),
    });

    if (result) await setCache(cacheKey, result, CACHE_TTL);
    return result;
}

export async function revokeTokenRepository(token: string) {
    await db.delete(token_users).where(eq(token_users.token, token));
    await delCache(`token:${token}`);
}

export async function revokeTokenRepositoryByAccessToken(accessToken: string) {
    await db.delete(token_users).where(eq(token_users.accessToken, accessToken));
    await delCache(`access:${accessToken}`);
}