import {
  reducePropertyValuesToObject,
  WorkflowExecutionContext,
  WorkflowExecutionResult,
} from '@nqframework/models';
import { WorkflowTriggerInstance } from '@nqframework/models';
import { evaluateProperties } from '../../core/utils';

export const evaluateTriggerOutput = async (
  trigger: WorkflowTriggerInstance,
  result: WorkflowExecutionResult,
  context: WorkflowExecutionContext,
): Promise<any> => {
  if (!trigger.output || !trigger.output.length) {
    return [];
  }
  const values = await evaluateProperties(trigger.output, { result, context });
  return reducePropertyValuesToObject(values);
};
