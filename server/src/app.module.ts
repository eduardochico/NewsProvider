import { Module } from '@nestjs/common';
import { GrokController } from './grok.controller';
import { GrokService } from './grok.service';
import { NewsController } from './news.controller';

@Module({
  imports: [],
  controllers: [GrokController, NewsController],
  providers: [GrokService],
})
export class AppModule {}
