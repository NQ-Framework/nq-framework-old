import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { ActionsModule } from '../actions/actions.module';
import { WorkflowRepositoryService } from './workflow-repository.service';
import { WorkflowExecutionService } from './workflow-execution/workflow-execution.service';
import { ApiTriggerController } from './api-trigger/api-trigger.controller';
import { WorkflowController } from './workflow.controller';
import { OrganizationModule } from 'src/organization/organization.module';

@Module({
  imports: [ActionsModule, CoreModule, OrganizationModule],
  providers: [WorkflowRepositoryService, WorkflowExecutionService],
  exports: [WorkflowRepositoryService, WorkflowExecutionService],
  controllers: [ApiTriggerController, WorkflowController],
})
export class WorkflowModule { }
