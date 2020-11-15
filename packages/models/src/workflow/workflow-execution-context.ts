import { ActionHandler } from "./actions/action-handler";
import { WorkflowExecutionData } from "./workflow-execution-data";

export interface WorkflowExecutionContext {
    isRunning: boolean;
    data: WorkflowExecutionData;
    stack: ActionHandler[];
}