import { Injectable } from '@nestjs/common';
import { ActionInstance, ActionLink, Workflow, WorkflowExecutionContext, WorkflowExecutionResult } from '@nqframework/models';
import { ActionService } from '../../actions/action.service';

@Injectable()
export class WorkflowExecutionService {

    constructor(private actionService: ActionService) { }

    async executeWorkflow(workflow: Workflow): Promise<WorkflowExecutionResult> {
        let context: WorkflowExecutionContext = {
            data: {
                data: [] as any
            },
            isRunning: true,
            startTime: new Date(),
            stack: []
        }
        if (!workflow.actionInstances) {
            workflow.actionInstances = [];
        };
        workflow.actionInstances = workflow.actionInstances.filter(ai => ai.isEnabled);

        if (!workflow.actionInstances || workflow.actionInstances.length === 0) {
            return {
                finalData: {
                    data: []
                }
            }
        }

        if (!workflow.actionLinks) {
            workflow.actionLinks = [];
        }
        workflow.actionLinks = workflow.actionLinks.filter(al => al.isEnabled && workflow.actionInstances!.some(ai => ai.id === al.fromId) && workflow.actionInstances!.some(ai => ai.id === al.toId));

        workflow.actionInstances.filter(ai => this.getParentActions(workflow, ai).length === 0).forEach(ai => { context.stack.push(ai) });
        return await this.executeStack(context, workflow);
    }

    private async executeStack(context: WorkflowExecutionContext, workflow: Workflow): Promise<WorkflowExecutionResult> {
        const previousOutputData: any = {};
        while (context.stack.length > 0) {
            const instance = context.stack[context.stack.length - 1];
            const result = await this.actionService.executeAction(instance, context);
            if (result.data) {
                context.data = result.data;
            }
            context.stack.pop();
            if (workflow.actionLinks) {
                const nextActions = workflow.actionLinks.filter(al => al.fromId === instance.id).map(al => workflow.actionInstances!.find(ai => ai.id === al.toId));
                nextActions.forEach(nextAction => {
                    if (nextAction !== undefined) {
                        context.stack.push(nextAction);
                    }
                });
            }
        }
        return {
            finalData: context.data
        }
    }


    private getParentActions(workflow: Workflow, actionInstance: ActionInstance): ActionInstance[] {
        const links = workflow.actionLinks as ActionLink[];
        return links.filter(al => al.toId === actionInstance.id).map(link => workflow.actionInstances!.find(ai => ai.id === link.fromId)) as ActionInstance[];
    }
}
