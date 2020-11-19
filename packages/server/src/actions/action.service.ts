import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  ActionInstance,
  ActionResult,
  WorkflowExecutionContext,
} from '@nqframework/models';
import { evaluateProperties } from '../core/utils';
import { getHandler } from './get-handler';

@Injectable()
export class ActionService {
  constructor(private moduleRef: ModuleRef) {}
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
      this.moduleRef,
    );
    return { propertyValues: actionProperties, outputValues: result };
  }
}
