import { Injectable } from '@nestjs/common';
import { Workflow, WorkflowExecutionResult } from '@nqframework/models';

@Injectable()
export class WorkflowExecutionService {

    async executeWorkflow(workflow: Workflow): Promise<WorkflowExecutionResult> {
        return {
            finalData: {
                data: [{ test: 'test ok' }]
            }
        }
    }
}
