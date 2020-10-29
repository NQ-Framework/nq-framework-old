import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
async function bootstrap() {

  if (process.env.GCLOUD_SECRETS) {
    await loadSecretManagerValues();
  }
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.setGlobalPrefix('v1');
  const port = configService.get<number>('port');
  await app.listen(port ?? 8080);
  console.log('app now listening on port ', port ?? 8080);



  async function loadSecretManagerValues() {
    const client = new SecretManagerServiceClient();
    const name = 'projects/nq-framework/secrets/server_firebase_private_key/versions/latest';
    const [version] = await client.accessSecretVersion({ name });
    if (version && version.payload && version.payload.data) {
      const secretValue = version.payload.data.toString();
      process.env.PRIVATE_KEY = secretValue;
      console.log('Loaded secret values from secret manager');
    }
    else {
      console.error('Tried to load secret values from secret manager but failed.')
    }
  }
}
bootstrap();