import { WorkflowTriggerBase } from "./workflow-trigger-base";

export interface WorkflowTriggerApi extends WorkflowTriggerBase {
    type: "api",
    endpointName?: string
}