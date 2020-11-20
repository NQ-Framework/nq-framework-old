import {
  WorkflowExecutionContext,
  WorkflowExecutionResult,
} from '@nqframework/models';
import { ActionService } from '../../actions/action.service';
import { loadFollowingActionsInChain } from './load-following-actions-in-chain';
import { updateContextWithActionResult } from './update-context-with-action-result';

export async function executeStack(
  context: WorkflowExecutionContext,
  actionService: ActionService,
): Promise<WorkflowExecutionResult> {
  const workflow = context.workflow;

  while (context.stack.length > 0) {
    const actionInstance = context.stack[context.stack.length - 1];

    const result = await actionService.executeAction(actionInstance, context);

    updateContextWithActionResult(context, actionInstance, result);
    context.stack.pop();

    loadFollowingActionsInChain(workflow, actionInstance, context);
  }

  return {
    data: context.actions,
    finalOutput: context.input,
  };
}
