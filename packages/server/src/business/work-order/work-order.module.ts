import { Module } from '@nestjs/common';
import { LoggerModule } from '../../logger/logger.module';
import { DbConnectionModule } from '../../db-connection/db-connection.module';
import { WorkOrderController } from './work-order.controller';
import { WorkflowModule } from '../../workflow/workflow.module';

@Module({
  controllers: [WorkOrderController],
  imports: [DbConnectionModule, LoggerModule, WorkflowModule],
})
export class WorkOrderModule { }
