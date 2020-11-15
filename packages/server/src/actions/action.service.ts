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
    const inputValues = await this.evaluateInputValues(
      instance,
      workflowExecution,
    );
    const result = await actionHandler.handle(
      inputValues,
      instance,
      workflowExecution,
    );
    return result;
  }

  private async evaluateInputValues(
    instance: ActionInstance,
    execution: WorkflowExecutionContext,
  ): Promise<PropertyValue[]> {
    if (!Boolean(instance.configuration.input?.length)) {
      return [];
    }
    const inputValues: PropertyValue[] = [];
    for (let i = 0; i < instance.configuration.input.length; i++) {
      const inputProperty = instance.configuration.input[i];
      if (!inputProperty.value) {
        continue;
      }
      if (
        typeof inputProperty.value === 'string' &&
        inputProperty.value.startsWith('=')
      ) {
        const result = await this.evaluateExpression(
          `return ${inputProperty.value.slice(1)}`,
          execution,
        );
        inputValues.push({ name: inputProperty.name, value: result });
      } else {
        inputValues.push({
          name: inputProperty.name,
          value: inputProperty.value,
        });
      }
    }
    return inputValues;
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
