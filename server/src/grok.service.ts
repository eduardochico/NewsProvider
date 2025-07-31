import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import { getRedisClient } from './redis-client';
import { logRequest, logResponse, logError } from './logger';

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
            content: `Return a JSON object with a single top-level key articles, which maps to an array of exactly 10 viral news articles relevant to the es-MX locale (Spanish - Mexico). The articles must meet the following criteria:

Recency: Only include articles published within the last 3 days.

Virality: Articles should reflect trending or viral news as observed on X (formerly Twitter), other social platforms, or top-tier media outlets in Mexico.

Content quality: Each article must be factual, concise, and newsworthy.

Each object in the articles array must contain the following fields:

title: A clear, click-worthy headline (string)
summary: A 1–2 sentence summary capturing the essence of the article (string)
source: The media outlet or publisher name (string)
date: Publication date in ISO 8601 format (YYYY-MM-DD) (string)
referenceUrl: A direct URL to the original news article (string)
imageHint: A short textual description to guide image generation or selection (e.g. "crowd protesting outside Palacio Nacional") (string)
imageUrl: A direct URL to a thumbnail or featured image representing the article (string)
category: A classification of the article into one of the following categories:
"Politics"
"Technology"
"Red Notes" (i.e., crime and public safety)
"Sports"
"Entertainment"
or suggest a more appropriate category if the above are not suitable, such as "Health", "Business", "Culture", "Environment", or "Science"

Ensure that the final list of articles includes a diverse mix of categories and reflects what is currently resonating or trending with the Mexican audience on digital and social platforms.`,
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

      const start = Date.now();
      logRequest('POST', url, data);

      const response = await axios(config);
      const duration = Date.now() - start;
      logResponse('POST', url, response.data, duration);
      return response.data;
    } catch (err) {
      logError(err);
      console.error('Failed to fetch trending news from Grok:', err);
      throw new InternalServerErrorException(
        'Failed to fetch trending news from Grok',
      );
    }
  }

  async queryPrompt(prompt: string, systemRole?: string) {
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
            content: systemRole && systemRole.trim().length > 0
              ? systemRole
              : 'You are a news reporter.',
          },
          {
            role: 'user',
            content: prompt,
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
        timeout: 300_000,
      };

      const start = Date.now();
      logRequest('POST', url, data);

      const response = await axios(config);
      const duration = Date.now() - start;
      logResponse('POST', url, response.data, duration);
      return response.data;
    } catch (err) {
      logError(err);
      console.error('Failed to query Grok:', err);
      throw new InternalServerErrorException('Failed to query Grok');
    }
  }
}
