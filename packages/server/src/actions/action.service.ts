import { Injectable } from '@nestjs/common';
import { Action, ActionResult, WorkflowExecutionContext } from "@nqframework/models";
import { getHandler } from './get-handler';

@Injectable()
export class ActionService {

    async executeAction(action: Action, workflowExecution: WorkflowExecutionContext): Promise<ActionResult> {
        const actionHandler = getHandler(action);
        const result = await actionHandler.handle(workflowExecution);
        return result;
    }
}
