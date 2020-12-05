import { WorkflowExecutionContext } from "./workflow-execution-context";

export interface WorkflowExecutionResult {
  data: any;
  finalOutput: any;
  context?: WorkflowExecutionContext;
}
