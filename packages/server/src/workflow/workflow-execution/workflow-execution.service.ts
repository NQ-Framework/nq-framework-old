import { Injectable } from '@nestjs/common';
import {
  ActionInstance,
  ActionLink,
  PropertyValue,
  Workflow,
  WorkflowExecutionContext,
  WorkflowExecutionResult,
} from '@nqframework/models';
import {
  evaluateProperties,
  reducePropertyValuesToObject,
} from '../../core/utils';
import { ActionService } from '../../actions/action.service';

@Injectable()
export class WorkflowExecutionService {
  constructor(private actionService: ActionService) {}

  async executeWorkflow(
    workflow: Workflow,
    input: PropertyValue[],
  ): Promise<WorkflowExecutionResult> {
    let context: WorkflowExecutionContext = {
      isRunning: true,
      startTime: new Date(),
      stack: [],
      actions: {},
      input: {},
      triggerInput: input,
      workflow: workflow,
    };

    context.input = reducePropertyValuesToObject(
      await evaluateProperties(input, context),
    );
    if (!workflow.actionInstances) {
      workflow.actionInstances = [];
    }
    workflow.actionInstances = workflow.actionInstances.filter(
      (ai) => ai.isEnabled,
    );

    if (!workflow.actionInstances || workflow.actionInstances.length === 0) {
      return {
        finalData: {} as any,
      };
    }

    if (!workflow.actionLinks) {
      workflow.actionLinks = [];
    }
    workflow.actionLinks = workflow.actionLinks.filter(
      (al) =>
        al.isEnabled &&
        workflow.actionInstances!.some((ai) => ai.name === al.fromName) &&
        workflow.actionInstances!.some((ai) => ai.name === al.toName),
    );

    workflow.actionInstances
      .filter((ai) => this.getParentActions(workflow, ai).length === 0)
      .forEach((ai) => {
        context.stack.push(ai);
      });
    return await this.executeStack(context, workflow);
  }

  private async executeStack(
    context: WorkflowExecutionContext,
    workflow: Workflow,
  ): Promise<WorkflowExecutionResult> {
    while (context.stack.length > 0) {
      const instance = context.stack[context.stack.length - 1];
      const result = await this.actionService.executeAction(instance, context);
      context.actions[instance.name as any] = {
        properties: reducePropertyValuesToObject(result.propertyValues),
        values: reducePropertyValuesToObject(result.outputValues),
      };
      context.input = reducePropertyValuesToObject(result.outputValues);
      context.stack.pop();
      if (workflow.actionLinks) {
        const nextActions = workflow.actionLinks
          .filter((al) => al.fromName === instance.name)
          .map((al) =>
            workflow.actionInstances!.find((ai) => ai.name === al.toName),
          );
        nextActions.forEach((nextAction) => {
          if (nextAction !== undefined) {
            context.stack.push(nextAction);
          }
        });
      }
    }
    return {
      finalData: context.actions,
    };
  }

  private getParentActions(
    workflow: Workflow,
    actionInstance: ActionInstance,
  ): ActionInstance[] {
    const links = workflow.actionLinks as ActionLink[];
    return links
      .filter((al) => al.toName === actionInstance.name)
      .map((link) =>
        workflow.actionInstances!.find((ai) => ai.name === link.fromName),
      ) as ActionInstance[];
  }
}
