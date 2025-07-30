import { Body, Controller, Post, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GrokService } from './grok.service';
import { ApiKeyGuard } from './api-key.guard';

@ApiTags('prompt')
@Controller('prompt')
export class PromptController {
  constructor(private readonly grokService: GrokService) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  @ApiOperation({ summary: 'Query Grok with a custom prompt' })
  async handlePrompt(
    @Body('prompt') prompt?: string,
    @Body('system_role') systemRole?: string,
  ) {
    if (!prompt) {
      throw new BadRequestException('Prompt is required');
    }
    const result = await this.grokService.queryPrompt(prompt, systemRole);
    console.debug('Sending prompt response');
    return result;
  }
}
