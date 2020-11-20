import {
  ActionInstance,
  ActionResult,
  WorkflowExecutionContext,
} from '@nqframework/models';
import { reducePropertyValuesToObject } from '../../core/utils';

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
