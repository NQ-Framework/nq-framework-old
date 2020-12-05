import {
  reducePropertyValuesToObject,
  WorkflowExecutionContext,
  WorkflowExecutionResult,
} from '@nqframework/models';
import { WorkflowTriggerBase } from '@nqframework/models/build/workflow/triggers/workflow-trigger-base';
import { evaluateProperties } from '../../core/utils';

export const evaluateTriggerOutput = async (
  trigger: WorkflowTriggerBase,
  result: WorkflowExecutionResult,
  context: WorkflowExecutionContext,
): Promise<any> => {
  if (!trigger.output || !trigger.output.length) {
    return [];
  }
  const values = await evaluateProperties(trigger.output, { result, context });
  return reducePropertyValuesToObject(values);
};
