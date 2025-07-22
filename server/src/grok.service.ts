import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import * as https from 'node:https';

@Injectable()
export class GrokService {
  async fetchNews(prompt: string) {
    const apiKey = process.env.GROK_API_KEY;
    const url = process.env.GROK_API_URL ?? 'https://api.grok.ai/v1/query';
    if (!apiKey) {
      throw new InternalServerErrorException('GROK_API_KEY not configured');
    }

    try {
      const host = new URL(url).hostname;
      const servername = host === 'api.grok.ai' ? 'grok.ai' : host;
      const httpsAgent = new https.Agent({ servername });
      const response = await axios.get(url, {
        params: { prompt },
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        httpsAgent,
      });
      return response.data;
    } catch (err) {
      console.error('GrokService error:', err);
      let message = 'Failed to fetch data from Grok';
      if (err instanceof Error) {
        message = err.message;
        if ('code' in err && (err as any).code === 'ENOTFOUND') {
          message =
            'Unable to resolve host for GROK_API_URL. Verify the URL and your network connectivity.';
        }
      }
      throw new InternalServerErrorException(`Failed to fetch data from Grok: ${message}`);
    }
  }
}
