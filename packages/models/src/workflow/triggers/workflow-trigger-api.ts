import { WorkflowTriggerBase } from "./workflow-trigger-base";

export interface WorkflowTriggerApi extends WorkflowTriggerBase {
    type: "api",
    endpoint: string
    verb: ("GET" | "POST" | "PUT" | "PATCH" | "DELETE")[]
}