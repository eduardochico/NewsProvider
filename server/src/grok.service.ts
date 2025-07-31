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
            content: `Return a JSON object with a single top-level key articles, which maps to an array of exactly 10 viral news articles relevant to the es-MX locale (Spanish - Mexico). These articles must meet all of the following criteria:

Content Requirements:
Recency: Only include news published within the last 3 calendar days.
Virality: Articles must be trending or viral based on engagement from X (formerly Twitter), other major social platforms, or Mexico’s leading media outlets.
Authenticity: ✅ Use only real, verifiable information — including actual titles, summaries, dates, media sources, URLs, and images.
❌ Do not invent, simulate, or suggest article content, titles, images, or sources.

Structure:
Each object in the articles array must contain only real-world data in the following fields:
title: Accurate headline of the original article (string)
summary: A 1–2 sentence real summary from the article itself (string)
source: Verified name of the media outlet or publisher (string)
date: Actual publication date in ISO 8601 format (YYYY-MM-DD) (string)
referenceUrl: Direct link to the original, publicly accessible article (string)
imageUrl: Actual URL of the featured or thumbnail image from the article (string)
imageHint: A short text description of the real image content (e.g. "Andrés Manuel López Obrador in morning press conference") (string)
category: Must classify the article into one of the following:
"Politics"
"Technology"
"Red Notes" (crime/public safety)
"Sports"
"Entertainment"
Or, if more appropriate, suggest a realistic and commonly used category like "Business", "Health", "Science", "Culture", or "Environment"

Notes:
Ensure a diverse distribution across categories.
All URLs (both article and image) must be valid and active.
Do not use fictional examples, placeholders, or approximations.
The final result should represent current trending topics in Mexico as reflected in real-time digital media.`,
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
