import {
  PropertyValue,
  Workflow,
  WorkflowExecutionContext,
} from '@nqframework/models';
import {
  evaluateProperties,
  reducePropertyValuesToObject,
} from '../../core/utils';
import { initializeContext } from './initialize-context';

export async function createExecutionContext(
  input: PropertyValue[],
  workflow: Workflow,
): Promise<WorkflowExecutionContext> {
  let context: WorkflowExecutionContext = {
    isRunning: true,
    startTime: new Date(),
    stack: [],
    actions: {},
    input: {},
    triggerInput: input,
    workflow: workflow,
  };
  const evaluatedProps = await evaluateProperties(input, context);
  context.input = reducePropertyValuesToObject(evaluatedProps);

  context = initializeContext(context);

  return context;
}
