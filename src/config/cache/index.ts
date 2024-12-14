import { REDIS_URL } from '../../shared/constants';
import { createClient, RedisClientType } from 'redis';
import logger from '../logger';

export async function initializeRedisClient(): Promise<RedisClientType> {
    let redisClient: RedisClientType | null = null;
    if (redisClient) {
        return redisClient;
    }

    redisClient = createClient({
        url: REDIS_URL,
    });

    redisClient.on('error', (err) => {
        logger.error('Redis Client Error', err);
    });

    await redisClient.connect();
    logger.info(`Redis client connected to ${REDIS_URL}`);
    return redisClient;
}
