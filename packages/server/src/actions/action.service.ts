import { Injectable } from '@nestjs/common';
import {
  ActionInstance,
  ActionResult,
  PropertyValue,
  WorkflowExecutionContext,
} from '@nqframework/models';
import { evaluateExpression, evaluateProperties } from '../core/utils';
import { getHandler } from './get-handler';

@Injectable()
export class ActionService {
  async executeAction(
    instance: ActionInstance,
    workflowExecution: WorkflowExecutionContext,
  ): Promise<ActionResult> {
    const actionHandler = getHandler(instance.action);
    const actionProperties = await evaluateProperties(
      instance.configuration.input,
      workflowExecution,
    );
    const result = await actionHandler.handle(
      actionProperties,
      instance,
      workflowExecution,
    );
    return { propertyValues: actionProperties, outputValues: result };
  }
}
