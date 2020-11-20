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

@Injectable()
export class WorkflowExecutionService {
  constructor(private actionService: ActionService) {}

  async executeWorkflow(
    initialWorkflow: Workflow,
    input: PropertyValue[],
    triggerId: string,
  ): Promise<WorkflowExecutionResult> {
    const context: WorkflowExecutionContext = await createExecutionContext(
      input,
      initialWorkflow,
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
