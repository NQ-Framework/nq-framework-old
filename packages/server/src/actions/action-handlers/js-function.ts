import {
  ActionHandler,
  ActionInstance,
  PropertyValue,
  WorkflowExecutionContext,
} from '@nqframework/models';
import { evaluateExpression } from '../../core/utils';

export const handler: ActionHandler = {
  handle: async (
    propertyValues: PropertyValue[],
    actionInstance: ActionInstance,
    workflowExecution: WorkflowExecutionContext,
  ): Promise<PropertyValue[]> => {
    const code = propertyValues.find((i) => i.name === 'code')?.value;
    if (!code) {
      throw new Error('Missing required parameter code');
    }

    const output = await evaluateExpression(code, {
      actionInstance,
      propertyValues,
      workflowExecution
    });

    return [
      {
        name: 'output',
        value: output,
      },
    ];
  },
};
