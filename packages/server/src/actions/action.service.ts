import { Injectable } from '@nestjs/common';
import { ActionInstance, ActionResult, WorkflowExecutionContext } from "@nqframework/models";
import { getHandler } from './get-handler';

@Injectable()
export class ActionService {

    async executeAction(instance: ActionInstance, workflowExecution: WorkflowExecutionContext): Promise<ActionResult> {
        const actionHandler = getHandler(instance.action);
        const result = await actionHandler.handle(instance, workflowExecution);
        return result;
    }
}
