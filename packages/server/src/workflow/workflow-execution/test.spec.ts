// import { Test, TestingModule } from '@nestjs/testing';
// import { mockWorkflow } from '../mocks/mock-workflow';
// import { WorkflowExecutionService } from './workflow-execution.service';
// import { createExecutionContext } from "./create-execution-context"
// import { ActionService } from '../../actions/action.service';
// import { mockExecutionContext } from '../mocks/mock-execution-context';

import { createExecutionContext } from './create-execution-context';

jest.mock('./create-execution-context', () => {
  return jest.fn();
});

describe('WorkflowExecutionService', () => {
  // let service: WorkflowExecutionService;

  beforeEach(async () => {
    // const module: TestingModule = await Test.createTestingModule({
    //   providers: [
    //     WorkflowExecutionService,
    //     { provide: ActionService, useValue: {} }
    //   ],
    // }).compile();
    // service = module.get<WorkflowExecutionService>(WorkflowExecutionService);
  });

  it('should call create context', async () => {
    // executeActionMock.mockImplementation(
    //   (): ActionResult => {
    //     return {
    //       propertyValues: [
    //         {
    //           name: 'message',
    //           value: 'test value',
    //         },
    //       ],
    //       outputValues: [{ name: 'message', value: 'test value' }],
    //     };
    //   },
    // );
    // (createExecutionContext as jest.Mock).mockImplementation(() => {
    //   return mockExecutionContext;
    // });
    // const result = await service.executeWorkflow(mockWorkflow, []);
    // expect(createExecutionContext).toHaveBeenNthCalledWith(expect.any(Object),
    //   mockWorkflow
    // );

    // expect(result).toEqual({
    //   data: {
    //     'mock action instance id': {
    //       values: { message: 'test value' },
    //       properties: { message: 'test value' },
    //     },
    //     'mock action instance id 2': {
    //       values: { message: 'test value' },
    //       properties: { message: 'test value' },
    //     },
    //   },
    //   finalOutput: {
    //     message: 'test value',
    //   },
    // });
  });
});
