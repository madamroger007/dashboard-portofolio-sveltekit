import redis from '$lib/utils/redisClient';

const CACHE_TTL = 60 * 5;

export async function getCache<T>(key: string): Promise<T | null> {
    try {
        const cached = await redis.get(key);
        return cached ? (JSON.parse(cached) as T) : null;
    } catch (error) {
        console.error('Redis get error:', error);
        return null;
    }
}

export async function setCache(key: string, value: unknown, ttl = CACHE_TTL) {
    try {
        await redis.set(key, JSON.stringify(value), 'EX', ttl);
    } catch (error) {
        console.error('Redis set error:', error);
    }
}

export async function delCache(pattern: string) {
    try {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) await redis.del(keys);
    } catch (error) {
        console.error('Redis del error:', error);
    }
}
