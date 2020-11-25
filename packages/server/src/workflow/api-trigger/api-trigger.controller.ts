import {
  All,
  BadRequestException,
  Controller,
  NotFoundException,
  Query,
  Req,
} from '@nestjs/common';
import { Workflow, WorkflowTriggerApi } from '@nqframework/models';
import { Request } from 'express';
import { LoggerService } from '../../core/logger.service';
import { WorkflowExecutionService } from '../workflow-execution/workflow-execution.service';
import { WorkflowRepositoryService } from '../workflow-repository.service';

const allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

@Controller('api')
export class ApiTriggerController {
  constructor(
    private workflowService: WorkflowRepositoryService,
    private logger: LoggerService,
    private workflowExecutionService: WorkflowExecutionService,
  ) {
    logger.setContext('Api Trigger Controller');
  }
  @All('*')
  async getSomething(@Req() req: Request, @Query() query: any) {
    if (!allowedMethods.includes(req.method)) {
      throw new BadRequestException();
    }
    const wfs = await this.workflowService.getWorkflowsByOrganizationEndpoint(
      req.organizationId,
      req.params[0],
    );
    let trigger: WorkflowTriggerApi | undefined;

    const targetWorkflow: Workflow | undefined = wfs.find((w) => {
      const trig = w.triggers.find(
        (t) =>
          t.type === 'api' &&
          (t as WorkflowTriggerApi).verb.includes(req.method as any),
      );
      if (!trig) {
        return false;
      }
      trigger = trig as WorkflowTriggerApi;
      return true;
    });
    if (!targetWorkflow) {
      this.logger.warn(
        `could not find workflow. endpoint: ${req.params[0]}  method: ${req.method} org: ${req.organizationId}`,
      );
      throw new NotFoundException();
    }
    this.logger.debug(
      'Triggering workflow: ' +
      targetWorkflow?.name +
      ' '
    );

    const inputs = trigger?.input || [];
    req.query;
    for (const queryKey of Object.keys(query)) {
      inputs.push({ name: queryKey, value: query[queryKey] });
    }
    const result = await this.workflowExecutionService.executeWorkflow(
      targetWorkflow,
      trigger?.input || [],
      trigger?.id || '',
    );
    return result;
  }
}
