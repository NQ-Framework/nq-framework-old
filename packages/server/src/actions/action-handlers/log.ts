import {
  ActionHandler,
  ActionInstance,
  ActionResult,
  PropertyValue,
  WorkflowExecutionContext,
} from '@nqframework/models';

export const handler: ActionHandler = {
  handle: async (
    inputValues: PropertyValue[],
    actionInstance: ActionInstance,
    workflowExecution: WorkflowExecutionContext,
  ): Promise<ActionResult> => {
    const message = inputValues.find((i) => i.name === 'message')?.value;
    console.log(
      'Log action instance says :' +
        message +
        ' instance: ' +
        JSON.stringify(actionInstance) +
        '  context: ' +
        JSON.stringify(workflowExecution.data),
    );
    return {
      data: {
        data: [...workflowExecution.data.data, { message }],
      },
    };
  },
};
