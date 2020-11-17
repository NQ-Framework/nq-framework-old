import { Module } from '@nestjs/common';
import { CoreModule } from '../../core/core.module';
import { DbConnectionModule } from '../../db-connection/db-connection.module';
import { WorkOrderController } from './work-order.controller';
import { WorkflowModule } from '../../workflow/workflow.module';

@Module({
  controllers: [WorkOrderController],
  imports: [DbConnectionModule, CoreModule, WorkflowModule],
})
export class WorkOrderModule {}
