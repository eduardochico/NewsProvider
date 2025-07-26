import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import * as https from 'node:https';
import { getRedisClient } from './redis-client';

function logHttpRequest(
  method: string,
  url: string,
  data: any,
  config: AxiosRequestConfig,
) {
  const lines: string[] = [`${method.toUpperCase()} ${url}`];
  if (config.headers) {
    for (const [key, value] of Object.entries(config.headers)) {
      lines.push(`${key}: ${String(value)}`);
    }
  }
  lines.push('');
  if (data) {
    lines.push(
      typeof data === 'string' ? data : JSON.stringify(data, null, 2),
    );
  }
  console.debug(lines.join('\n'));
}

@Injectable()
export class GrokService {

  async trendingNews() {
    const client = await getRedisClient();
    const cached = await client.get('news:latest');
    if (!cached) {
      throw new InternalServerErrorException('No cached news available');
    }
    try {
      return JSON.parse(cached);
    } catch {
      return cached;
    }
  }

  async fetchTrendingNewsFromApi() {
    const apiKey = process.env.GROK_API_KEY;
    const url =
      process.env.GROK_COMPLETION_URL ??
      'https://api.x.ai/v1/chat/completions';
    if (!apiKey) {
      throw new InternalServerErrorException('GROK_API_KEY not configured');
    }
    try {
      const data = {
        messages: [
          {
            role: 'system',
            content: 'You are a news reporter.',
          },
          {
            role: 'user',
            content:
              'Return a JSON object with a single key articles which is an array of 10 viral news articles for the locale es-MX. The news must be from the last 3 days. Each article object must have the following keys: title, summary, source, date, referenceUrl, and imageHint. Based on recent viral news or trending news right now on X and other media.',
          },
        ],
        model: 'grok-4',
        stream: false,
        search_parameters: { mode: 'on' },
      };

      const config: AxiosRequestConfig = {
        url,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        data,
        // Allow up to 5 minutes for the request to complete
        timeout: 300_000,
      };

      logHttpRequest('POST', url, data, config);

      const response = await axios(config);
      return response.data;
    } catch (err) {
      console.error('Failed to fetch trending news from Grok:', err);
      throw new InternalServerErrorException(
        'Failed to fetch trending news from Grok',
      );
    }
  }
}
