import { Module } from '@nestjs/common';
import { GatewayModule } from '../../gateway/gateway.module';
import { WorkOrderController } from './work-order.controller';

@Module({
  controllers: [WorkOrderController],
  imports: [GatewayModule],
})
export class WorkOrderModule {}
