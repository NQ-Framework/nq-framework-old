import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ActionsController } from './actions.controller';
import { SSEMiddleware } from "nestjs-sse";
import { ConfiugrationModule } from '../config/configuration.module';

@Module({
  imports: [ConfiugrationModule],
  controllers: [ActionsController]
})
export class ActionsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SSEMiddleware)
      .forRoutes('actions/recieve');
  }
}
