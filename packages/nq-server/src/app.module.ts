import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { FirebaseAuthMiddleware } from './firebase';
import configuration from './config/configuration';
import { ConfiugrationModule } from './config/configuration.module';
import { WorkOrderModule } from './business/work-order/work-order.module';
import { LoggerModule } from './logger/logger.module';

const configImport = ConfigModule.forRoot({
  envFilePath: '.development.env',
  isGlobal: true,
  load: [configuration],
});

@Module({
  imports: [configImport, ConfiugrationModule, WorkOrderModule, LoggerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  async configure(consumer: MiddlewareConsumer) {
    return new Promise((resolve) => {
      resolve(
        consumer
          .apply(FirebaseAuthMiddleware)
          .exclude('v1/api')
          .forRoutes('*'),
      );
    });
  }
}
