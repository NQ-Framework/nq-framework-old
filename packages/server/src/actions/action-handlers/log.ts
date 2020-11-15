import { ActionHandler, ActionInstance, ActionResult, WorkflowExecutionContext } from '@nqframework/models';

export const handler: ActionHandler = {
    handle: async (actionInstance: ActionInstance, workflowExecution: WorkflowExecutionContext): Promise<ActionResult> => {
        const message = actionInstance.configuration.input.find(i => i.name === 'message')?.value;
        console.log('Log action instance says :' + message + ' instance: ' + JSON.stringify(actionInstance) + '  context: ' + JSON.stringify(workflowExecution.data));
        return {
            data: {
                data: [...workflowExecution.data.data, { message }],
            }
        }
    }
}