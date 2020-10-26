import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ActionsController } from './actions.controller';
import { SSEMiddleware } from '@irreal/nestjs-sse';
import { ConfiugrationModule } from '../config/configuration.module';
import { ConnectorModule } from '../connector/connector.module';

@Module({
  imports: [ConfiugrationModule, ConnectorModule],
  controllers: [ActionsController],
})
export class ActionsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SSEMiddleware).forRoutes('actions/receive');
  }
}
