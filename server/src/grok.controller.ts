import { Controller, Get } from '@nestjs/common';
import { GrokService } from './grok.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('grok')
@Controller('hello')
export class GrokController {
  constructor(private readonly grokService: GrokService) {}

  @Get()
  @ApiOperation({ summary: 'Return hello world from Grok' })
  async getHello() {
    return this.grokService.helloWorld();
  }
}
