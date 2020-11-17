import { PropertyValue } from "../property/property-value";
import { WorkflowExecutionContext } from "../workflow-execution-context";
import { ActionInstance } from "./action-instance";

export interface ActionHandler {
    handle(propertyValues: PropertyValue[], actionInstance: ActionInstance, workflowExecution: WorkflowExecutionContext): Promise<PropertyValue[]>
}