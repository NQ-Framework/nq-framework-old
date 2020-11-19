import {
  Workflow,
  WorkflowExecutionContext,
  WorkflowExecutionResult,
} from '@nqframework/models';
import { ActionService } from '../../actions/action.service';
import { reducePropertyValuesToObject } from '../../core/utils';

export async function executeStack(
  context: WorkflowExecutionContext,
  workflow: Workflow,
  actionService: ActionService,
): Promise<WorkflowExecutionResult> {
  while (context.stack.length > 0) {
    const instance = context.stack[context.stack.length - 1];
    const result = await actionService.executeAction(instance, context);
    context.actions[instance.name as any] = {
      properties: reducePropertyValuesToObject(result.propertyValues),
      values: reducePropertyValuesToObject(result.outputValues),
    };
    context.input = reducePropertyValuesToObject(result.outputValues);
    context.stack.pop();
    if (workflow.actionLinks) {
      const nextActions = workflow.actionLinks
        .filter((al) => al.fromName === instance.name)
        .map((al) =>
          workflow.actionInstances!.find((ai) => ai.name === al.toName),
        );
      nextActions.forEach((nextAction) => {
        if (nextAction !== undefined) {
          context.stack.push(nextAction);
        }
      });
    }
  }
  return {
    data: context.actions,
    finalOutput: context.input,
  };
}
