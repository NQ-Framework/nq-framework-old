import { Injectable } from '@nestjs/common';
import {
  ActionInstance,
  ActionResult,
  PropertyValue,
  WorkflowExecutionContext,
} from '@nqframework/models';
import { NodeVM, NodeVMOptions } from 'vm2';
import { getHandler } from './get-handler';

@Injectable()
export class ActionService {
  async executeAction(
    instance: ActionInstance,
    workflowExecution: WorkflowExecutionContext,
  ): Promise<ActionResult> {
    const actionHandler = getHandler(instance.action);
    const actionProperties = await this.evaluateProperties(
      instance,
      workflowExecution,
    );
    const result = await actionHandler.handle(
      actionProperties,
      instance,
      workflowExecution,
    );
    return { propertyValues: actionProperties, outputValues: result };
  }

  private async evaluateProperties(
    instance: ActionInstance,
    execution: WorkflowExecutionContext,
  ): Promise<PropertyValue[]> {
    if (!Boolean(instance.configuration.input.length)) {
      return [];
    }
    const propertyValues: PropertyValue[] = [];
    for (let i = 0; i < instance.configuration.input.length; i++) {
      const property = instance.configuration.input[i];
      if (!property.value) {
        continue;
      }
      if (
        typeof property.value === 'string' &&
        property.value.startsWith('=')
      ) {
        const result = await this.evaluateExpression(
          `return ${property.value.slice(1)}`,
          execution,
        );
        propertyValues.push({ name: property.name, value: result });
      } else {
        propertyValues.push({
          name: property.name,
          value: property.value,
        });
      }
    }
    return propertyValues;
  }

  private async evaluateExpression(
    expression: string,
    execution: WorkflowExecutionContext,
  ): Promise<any> {
    const sandbox = {
      ...execution,
    };

    const options: NodeVMOptions = {
      console: 'inherit',
      sandbox,
      require: {
        external: false as boolean,
        builtin: [] as string[],
      },
    };
    const vm = new NodeVM(options);
    const result = await vm.run(
      `module.exports = async function() {${expression}}()`,
      __dirname,
    );
    return result;
  }
}
