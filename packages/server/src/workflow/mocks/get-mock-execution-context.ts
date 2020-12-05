import { WorkflowExecutionContext } from '@nqframework/models';
import { mockOrganization } from './mock-organization';
import { mockWorkflow } from './mock-workflow';

export const getMockExecutionContext = (): WorkflowExecutionContext =>
  JSON.parse(
    JSON.stringify({
      actions: {
        'mock name': {
          properties: [{ name: 'mock prop', value: 'mock prop val' }],
          values: [{ name: 'mock value ', value: 'mock value val' }],
        },
      },
      input: { mockInput: 'mock input value' },
      id: 'mock execution context id',
      startedBy: 'mock user id',
      organization: mockOrganization,
      isRunning: true,
      stack: [],
      startTime: new Date('2020-11-20'),
      triggerInput: [{ name: 'trigInput', value: 'mock trigger input value' }],
      triggerOutput: { output: 'mock trigger output' },
      workflow: mockWorkflow,
    } as WorkflowExecutionContext),
  ) as WorkflowExecutionContext;
