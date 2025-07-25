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
    return this.grokService.trendingNews();
  }
}
