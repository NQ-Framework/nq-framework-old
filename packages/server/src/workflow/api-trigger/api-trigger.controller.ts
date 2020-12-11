import {
  All,
  BadRequestException,
  Controller,
  NotFoundException,
  Query,
  Req,
} from '@nestjs/common';
import {
  reducePropertyValuesToObject,
  Workflow,
  WorkflowTriggerInstance,
} from '@nqframework/models';
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
    let trigger: WorkflowTriggerInstance | undefined;

    const targetWorkflow: Workflow | undefined = wfs.find((w) => {
      const trig = w.triggers.find((t) => t.type === 'api');
      if (!trig) {
        return false;
      }
      const inputValues = reducePropertyValuesToObject(trig.input);
      if (
        inputValues.verbs &&
        (inputValues.verbs as string[]).includes(req.method)
      ) {
        trigger = trig;
        return true;
      }
      return false;
    });
    if (!targetWorkflow) {
      this.logger.warn(
        `could not find workflow. endpoint: ${req.params[0]}  method: ${req.method} org: ${req.organizationId}`,
      );
      throw new NotFoundException();
    }
    this.logger.debug('Triggering workflow: ' + targetWorkflow?.name + ' ');

    const inputs = trigger?.input || [];
    for (const queryKey of Object.keys(query)) {
      inputs.push({ name: 'q:' + queryKey, value: query[queryKey] });
    }
    const result = await this.workflowExecutionService.executeWorkflow(
      targetWorkflow,
      trigger?.input || [],
      trigger?.id || '',
      req.firebaseUser ? req.firebaseUser.uid : req.serviceAccount.name,
    );
    const responseContent = reducePropertyValuesToObject(
      result.context?.triggerOutput,
      false,
    ).output;
    if (query.debugWorkflow === 'true') {
      return {
        ...responseContent,
        workflowResult: result,
      };
    }
    return responseContent;
  }
}
