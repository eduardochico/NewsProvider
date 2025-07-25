import { GrokService } from './grok.service';
import { getRedisClient } from './redis-client';

async function main() {
  const service = new GrokService();
  const news = await service.fetchTrendingNewsFromApi();
  const client = await getRedisClient();
  await client.set('news:latest', JSON.stringify(news));
  await client.quit();
}

main().catch((err) => {
  console.error('Failed to fetch and store news', err);
  process.exit(1);
});
