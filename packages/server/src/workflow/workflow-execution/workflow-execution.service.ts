import { Injectable } from '@nestjs/common';
import {
  PropertyValue,
  Workflow,
  WorkflowExecutionContext,
  WorkflowExecutionResult,
} from '@nqframework/models';
import { ActionService } from '../../actions/action.service';
import { executeStack } from './execute-stack';
import { createExecutionContext } from './create-execution-context';
import { OrganizationService } from '../../organization/organization.service';

@Injectable()
export class WorkflowExecutionService {
  constructor(
    private actionService: ActionService,
    private organizationService: OrganizationService,
  ) { }

  async executeWorkflow(
    initialWorkflow: Workflow,
    input: PropertyValue[],
    triggerId: string,
    userId: string
  ): Promise<WorkflowExecutionResult> {
    const organization = await this.organizationService.getOrganization(
      initialWorkflow.organizationId,
    );
    if (!organization) {
      throw new Error('Cannot start workflow, missing valid organization');
    }
    const context: WorkflowExecutionContext = await createExecutionContext(
      input,
      initialWorkflow,
      organization,
      userId
    );
    const workflow = context.workflow;

    const trigger = workflow.triggers.find((t) => t.id === triggerId);
    if (!trigger) {
      throw new Error('invalid trigger id, cannot start workflow');
    }
    trigger.actions.forEach((actionName) => {
      const action =
        actionName &&
        workflow.actionInstances.find((ai) => ai.name === actionName);
      if (!action) {
        throw new Error(
          'Invalid action name in trigger, cannot start workflow',
        );
      }
      context.stack.push(action);
    });
    return await executeStack(context, this.actionService);
  }
}
