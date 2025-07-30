import { Module } from '@nestjs/common';
import { GrokService } from './grok.service';
import { NewsController } from './news.controller';
import { PromptController } from './prompt.controller';
import { ApiKeyGuard } from './api-key.guard';

@Module({
  imports: [],
  controllers: [NewsController, PromptController],
  providers: [GrokService, ApiKeyGuard],
})
export class AppModule {}
