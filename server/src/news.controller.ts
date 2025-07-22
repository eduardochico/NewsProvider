import { Controller, Get } from '@nestjs/common';
import { GrokService } from './grok.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(private readonly grokService: GrokService) {}

  @Get()
  @ApiOperation({ summary: 'Get recent viral news from Mexico' })
  async getNews() {
    const prompt =
      'give me the recent viral news from mexico, the answer will be on json format and you should consider the fields: title, content, image (any image that represent the news), links(list of links covering the news)';
    return this.grokService.fetchNews(prompt);
  }
}
