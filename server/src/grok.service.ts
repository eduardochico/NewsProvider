import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GrokService {
  async fetchNews(prompt: string) {
    const apiKey = process.env.GROK_API_KEY;
    const url = process.env.GROK_API_URL ?? 'https://api.grok.com/v1/query';
    if (!apiKey) {
      throw new InternalServerErrorException('GROK_API_KEY not configured');
    }

    try {
      const response = await axios.post(
        url,
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (err) {
      console.error('GrokService error:', err);
      const message = err instanceof Error ? err.message : 'Failed to fetch data from Grok';
      throw new InternalServerErrorException(`Failed to fetch data from Grok: ${message}`);
    }
  }
}
