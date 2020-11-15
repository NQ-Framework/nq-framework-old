import { ActionInstance } from "./actions/action-instance";
import { WorkflowExecutionData } from "./workflow-execution-data";

export interface WorkflowExecutionContext {
    isRunning: boolean;
    data: WorkflowExecutionData;
    stack: ActionInstance[];
}