import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GrokService } from './grok.service';

@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(private readonly grokService: GrokService) {}

  @Get()
  @ApiOperation({ summary: 'Return trending news articles from Grok' })
  async getNews() {
    const result = await this.grokService.trendingNews();
    console.debug('Sending trending news response');
    return result;
  }
}
