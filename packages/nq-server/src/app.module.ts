import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { FirebaseAuthMiddleware } from './firebase';
import configuration from './config/configuration';
import { ConfiugrationModule } from './config/configuration.module';
import { ActionsModule } from './actions/actions.module';
import { ConnectorService } from './connector/connector.service';

const configImport = ConfigModule.forRoot({
  envFilePath: '.development.env',
  isGlobal: true,
  load: [configuration],
});

@Module({
  imports: [configImport, ConfiugrationModule, ActionsModule],
  controllers: [AppController],
  providers: [AppService, ConnectorService],
})
export class AppModule implements NestModule {
  async configure(consumer: MiddlewareConsumer) {
    return new Promise((resolve) => {
      resolve(
        consumer
          .apply(FirebaseAuthMiddleware)
          .exclude('v1/api')
          .exclude('v1/actions/recieve')
          .forRoutes('*'),
      );
    });
  }
}
