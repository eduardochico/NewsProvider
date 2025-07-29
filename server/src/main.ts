import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as fs from 'fs';
import type { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const keyPath = process.env.SSL_KEY_PATH;
  const certPath = process.env.SSL_CERT_PATH;
  const httpsOptions =
    keyPath && certPath
      ? {
          key: fs.readFileSync(keyPath),
          cert: fs.readFileSync(certPath),
        }
      : undefined;

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    ...(httpsOptions ? { httpsOptions } : {}),
  });

  app.enable('trust proxy');
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.secure) {
      return next();
    }
    res.redirect(301, `https://${req.headers.host}${req.originalUrl}`);
  });
  const config = new DocumentBuilder()
    .setTitle('Grok Hello World')
    .setDescription('Simple example using Grok API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => {
  console.error('Failed to start application', err);
  process.exit(1);
});
