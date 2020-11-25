import {
  ActionInstance,
  ActionResult,
  reducePropertyValuesToObject,
  WorkflowExecutionContext,
} from '@nqframework/models';

export function updateContextWithActionResult(
  context: WorkflowExecutionContext,
  actionInstance: ActionInstance,
  result: ActionResult,
) {
  context.actions[actionInstance.name as any] = {
    properties: reducePropertyValuesToObject(result.propertyValues),
    values: reducePropertyValuesToObject(result.outputValues),
  };

  context.input = reducePropertyValuesToObject(result.outputValues);
}
