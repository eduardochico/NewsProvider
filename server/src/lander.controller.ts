import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { GrokService } from './grok.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('lander')
@Controller('lander')
export class LanderController {
  constructor(private readonly grokService: GrokService) {}

  @Get()
  @ApiOperation({ summary: 'Query Grok with a custom prompt' })
  async lander(@Query('prompt') prompt?: string) {
    if (!prompt) {
      throw new BadRequestException('prompt query parameter is required');
    }
    return this.grokService.fetchNews(prompt);
  }
}
