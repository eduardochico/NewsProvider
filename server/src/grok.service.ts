import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import * as https from 'node:https';

@Injectable()
export class GrokService {
  async helloWorld() {
    const apiKey = process.env.GROK_API_KEY;
    const url = process.env.GROK_API_URL ?? 'https://api.grok.ai/v1/query';
    if (!apiKey) {
      throw new InternalServerErrorException('GROK_API_KEY not configured');
    }
    try {
      const host = new URL(url).hostname;
      const servername = host === 'api.grok.ai' ? 'grok.ai' : host;
      const httpsAgent = new https.Agent({ servername });
      const response = await axios.post(
        url,
        { prompt: 'hello world' },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            Accept: 'application/json',
          },
          httpsAgent,
        },
      );
      return response.data;
    } catch (err) {
      console.error('Failed to fetch data from Grok:', err);
      throw new InternalServerErrorException('Failed to fetch data from Grok');
    }
  }

  async trendingNews() {
    const apiKey = process.env.GROK_API_KEY;
    const url =
      process.env.GROK_COMPLETION_URL ??
      'https://api.x.ai/v1/chat/completions';
    if (!apiKey) {
      throw new InternalServerErrorException('GROK_API_KEY not configured');
    }
    try {
      const host = new URL(url).hostname;
      const servername = host.startsWith('api.') ? host.slice(4) : host;
      const httpsAgent = new https.Agent({ servername });
      const response = await axios.post(
        url,
        {
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
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          httpsAgent,
          timeout: 3600_000,
        },
      );
      return response.data;
    } catch (err) {
      console.error('Failed to fetch trending news from Grok:', err);
      throw new InternalServerErrorException(
        'Failed to fetch trending news from Grok',
      );
    }
  }
}
