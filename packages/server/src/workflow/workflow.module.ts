import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { ActionsModule } from '../actions/actions.module';
import { WorkflowService } from './workflow.service';
import { WorkflowExecutionService } from './workflow-execution/workflow-execution.service';

@Module({
  imports: [ActionsModule, LoggerModule],
  providers: [WorkflowService, WorkflowExecutionService,],
  exports: [WorkflowService, WorkflowExecutionService]
})
export class WorkflowModule { }
