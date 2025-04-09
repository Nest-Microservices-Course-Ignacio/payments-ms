import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/envs';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api');

  await app.listen(envs.port);
  Logger.log(`Starting server on port ${envs.port}`, 'Payments Service');
}
bootstrap();
