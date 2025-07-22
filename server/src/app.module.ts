import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GrokService } from './grok.service';
import { NewsController } from './news.controller';
import { LanderController } from './lander.controller';

@Module({
  imports: [],
  controllers: [AppController, NewsController, LanderController],
  providers: [AppService, GrokService],
})
export class AppModule {}
