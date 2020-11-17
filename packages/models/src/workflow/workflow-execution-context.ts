import { ActionInstance } from "./actions/action-instance";
import { Workflow } from "./workflow";

export interface WorkflowExecutionContext {
    isRunning: boolean;
    actions: { [key: string]: { properties: any, values: any } };
    input: any;
    stack: ActionInstance[];
    startTime: Date;
    workflow: Workflow;
}