import { Module } from '@nestjs/common';
import { LoggerModule } from '../../logger/logger.module';
import { DbConnectionModule } from '../../db-connection/db-connection.module';
import { WorkOrderController } from './work-order.controller';

@Module({
  controllers: [WorkOrderController],
  imports: [DbConnectionModule, LoggerModule],
})
export class WorkOrderModule { }
