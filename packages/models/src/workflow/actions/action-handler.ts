import { PropertyValue } from "../property/property-value";
import { WorkflowExecutionContext } from "../workflow-execution-context";
import { ActionInstance } from "./action-instance";
import { ActionResult } from "./action-result";

export interface ActionHandler {
    handle(inputValues: PropertyValue[], actionInstance: ActionInstance, workflowExecution: WorkflowExecutionContext): Promise<ActionResult>
}