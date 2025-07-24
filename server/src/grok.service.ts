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
      const response = await axios.get(url, {
        params: { prompt: 'hello world' },
        headers: { Authorization: `Bearer ${apiKey}` },
        httpsAgent,
      });
      return response.data;
    } catch (err) {
      console.error('Failed to fetch data from Grok:', err);
      throw new InternalServerErrorException('Failed to fetch data from Grok');
    }
  }
}
