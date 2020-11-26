import {
  Organization,
  PropertyValue,
  reducePropertyValuesToObject,
  Workflow,
  WorkflowExecutionContext,
} from '@nqframework/models';
import { evaluateProperties } from '../../core/utils';
import { initializeContext } from './initialize-context';

export async function createExecutionContext(
  input: PropertyValue[],
  workflow: Workflow,
  organization: Organization,
  userId: string
): Promise<WorkflowExecutionContext> {
  let context: WorkflowExecutionContext = {
    isRunning: true,
    startTime: new Date(),
    startedBy: userId,
    stack: [],
    actions: {},
    input: {},
    triggerInput: input,
    workflow: workflow,
    organization,
  };
  const evaluatedProps = await evaluateProperties(input, context);
  context.input = reducePropertyValuesToObject(evaluatedProps);

  context = initializeContext(context);

  return context;
}
