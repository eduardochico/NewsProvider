import { Module } from '@nestjs/common';
import { GrokController } from './grok.controller';
import { GrokService } from './grok.service';

@Module({
  imports: [],
  controllers: [GrokController],
  providers: [GrokService],
})
export class AppModule {}
