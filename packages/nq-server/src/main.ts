import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from './logger/logger.service';
import { loadSecretManagerValues } from './secretLoader';
async function bootstrap() {

  if (process.env.GCLOUD_SECRETS) {
    await loadSecretManagerValues();
  }
  const app = await NestFactory.create(AppModule);
  const loggerService = new LoggerService("system");
  app.useLogger(loggerService);
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.setGlobalPrefix('v1');
  const port = configService.get<number>('port');
  await app.listen(port ?? 8080);
  loggerService.log(`app now listening on port ${port ?? 8080}`);



}

  bootstrap();