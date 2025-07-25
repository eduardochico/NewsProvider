import { createClient, RedisClientType } from 'redis';

let client: RedisClientType | null = null;

export async function getRedisClient(): Promise<RedisClientType> {
  if (!client) {
    const url = process.env.REDIS_URL ?? 'redis://localhost:6379';
    client = createClient({ url });
    client.on('error', (err) => console.error('Redis error', err));
    await client.connect();
  }
  return client;
}
