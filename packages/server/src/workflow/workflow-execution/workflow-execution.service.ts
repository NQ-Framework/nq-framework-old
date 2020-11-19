import { Injectable } from '@nestjs/common';
import {
  PropertyValue,
  Workflow,
  WorkflowExecutionContext,
  WorkflowExecutionResult,
} from '@nqframework/models';
import { ActionService } from '../../actions/action.service';
import { getParentActions } from './get-parent-actions';
import { executeStack } from './execute-stack';
import { createExecutionContext } from './create-execution-context';

@Injectable()
export class WorkflowExecutionService {

  constructor(private actionService: ActionService) { }

  async executeWorkflow(
    workflow: Workflow,
    input: PropertyValue[],
  ): Promise<WorkflowExecutionResult> {

    const context: WorkflowExecutionContext = await createExecutionContext(input, workflow);

    context.workflow.actionInstances
      .filter((ai) => getParentActions(context.workflow, ai).length === 0)
      .forEach((ai) => {
        context.stack.push(ai);
      });
    return await executeStack(context, workflow, this.actionService);
  }
}
