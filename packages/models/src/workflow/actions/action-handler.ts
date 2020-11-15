import { WorkflowExecutionContext } from "../workflow-execution-context";
import { ActionResult } from "./action-result";

export interface ActionHandler {
    handle(workflowExecution: WorkflowExecutionContext): Promise<ActionResult>
}