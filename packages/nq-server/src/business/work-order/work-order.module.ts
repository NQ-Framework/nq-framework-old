import { Module } from '@nestjs/common';
import { DbConnectionModule } from '../../db-connection/db-connection.module';
import { WorkOrderController } from './work-order.controller';

@Module({
  controllers: [WorkOrderController],
  imports: [DbConnectionModule],
})
export class WorkOrderModule {}
