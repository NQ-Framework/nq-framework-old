import { WorkflowExecutionContext } from "../workflow-execution-context";
import { ActionInstance } from "./action-instance";
import { ActionResult } from "./action-result";

export interface ActionHandler {
    handle(actionInstance: ActionInstance, workflowExecution: WorkflowExecutionContext): Promise<ActionResult>
}