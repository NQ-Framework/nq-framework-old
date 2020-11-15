import { PropertyValue } from "../property/property-value";
import { WorkflowExecutionData } from "../workflow-execution-data";

export interface ActionResult {
    data?: WorkflowExecutionData;
    outputValues?: PropertyValue[];
}