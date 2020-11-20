import { Controller, Get, NotFoundException, Query, Req } from '@nestjs/common';
import { auth } from 'firebase-admin';
import { RequestRouterService } from '../../db-connection/request-router/request-router.service';
import { MsSqlFetcher } from '@nqframework/data-fetcher';
import { LoggerService } from '../../core/logger.service';
import { Request } from 'express';
import { WorkflowService } from '../../workflow/workflow.service';
import { WorkflowExecutionService } from '../../workflow/workflow-execution/workflow-execution.service';
import { WorkflowExecutionResult } from '@nqframework/models';

@Controller('work-order')
export class WorkOrderController {
  constructor(
    private router: RequestRouterService,
    private logger: LoggerService,
    private workflow: WorkflowService,
    private workflowExecution: WorkflowExecutionService,
  ) {
    logger.setContext('Work Order');
  }

  @Get('')
  async documents(@Req() req: Request): Promise<WorkflowExecutionResult> {
    const workflows = await this.workflow.getWorkflowsForOrganization(
      req.organizationId,
    );
    const workflow = workflows.find((w) => w.isActive);
    if (!workflow) {
      throw new NotFoundException();
    }
    const data = await this.workflowExecution.executeWorkflow(
      workflow,
      [],
      workflow.triggers[0].id,
    );
    return data;
  }

  @Get('anything')
  async getAnything(
    @Req() req: any,
    @Query('isProcedure') isProcedure: string,
    @Query('query') query: string,
  ): Promise<{ data: any }> {
    const user = req.firebaseUser as auth.DecodedIdToken;
    const response = (await this.router.getDataFetcher(
      user.uid,
      req.organizationId,
      req.dataSource,
    )) as MsSqlFetcher;
    const data = await response.get({
      isProcedure: isProcedure === 'yes' || isProcedure === 'true',
      query,
      params: [],
      outParams: [],
    });
    return { data };
  }
}
