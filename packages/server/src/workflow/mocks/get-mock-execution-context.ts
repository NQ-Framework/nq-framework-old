import { WorkflowExecutionContext } from '@nqframework/models';
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
      isRunning: true,
      stack: [],
      startTime: new Date('2020-11-20'),
      triggerInput: { trigInput: 'mock trigger input value' },
      workflow: mockWorkflow,
    }),
  ) as WorkflowExecutionContext;
