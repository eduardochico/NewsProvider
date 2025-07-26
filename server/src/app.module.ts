import { Module } from '@nestjs/common';
import { GrokService } from './grok.service';
import { NewsController } from './news.controller';

@Module({
  imports: [],
  controllers: [NewsController],
  providers: [GrokService],
})
export class AppModule {}
