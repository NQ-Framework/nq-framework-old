import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { ActionsModule } from '../actions/actions.module';
import { WorkflowService } from './workflow.service';
import { WorkflowExecutionService } from './workflow-execution/workflow-execution.service';
import { ApiTriggerController } from './api-trigger/api-trigger.controller';
import { WorkflowController } from './workflow.controller';

@Module({
  imports: [ActionsModule, CoreModule],
  providers: [WorkflowService, WorkflowExecutionService],
  exports: [WorkflowService, WorkflowExecutionService],
  controllers: [ApiTriggerController, WorkflowController],
})
export class WorkflowModule {}
