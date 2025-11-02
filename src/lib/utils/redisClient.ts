import Redis from 'ioredis';
import { env } from '$env/dynamic/private';

const redisUrl = env.REDIS_URL || 'redis://127.0.0.1:6379';

let redis: Redis;

if (redisUrl.startsWith('rediss://')) {
    redis = new Redis(redisUrl, {
        tls: {
            rejectUnauthorized: false,
        },
    });
} else {
    redis = new Redis(redisUrl);
}

redis.on('connect', () => console.log('✅ Redis connected:', redisUrl));
redis.on('error', (err) => console.error('❌ Redis error:', err));

export default redis;
