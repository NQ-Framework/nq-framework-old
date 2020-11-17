import { WorkflowTriggerBase } from "./workflow-trigger-base";

export interface WorkflowTriggerApi extends WorkflowTriggerBase {
    type: "api",
    endpointName?: string
    verb: ("GET" | "POST" | "PUT" | "PATCH" | "DELETE")[]
}