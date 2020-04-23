import { Module } from '@nestjs/common';
import { WorkOrderController } from './work-order.controller';

@Module({
  controllers: [WorkOrderController],
})
export class WorkOrderModule {}
