import { Test, TestingModule } from '@nestjs/testing';
import { mockWorkflow } from '../mocks/mock-workflow';
import { WorkflowExecutionService } from './workflow-execution.service';
import { createExecutionContext } from './create-execution-context';
import { ActionService } from '../../actions/action.service';
import { getMockExecutionContext } from '../mocks/get-mock-execution-context';
import { executeStack } from './execute-stack';
import { mockExecutionResult } from '../mocks/mock-execution-result';

jest.mock('./create-execution-context');
jest.mock('./execute-stack');

describe('WorkflowExecutionService', () => {
  let service: WorkflowExecutionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkflowExecutionService,
        { provide: ActionService, useValue: { type: 'mockService' } },
      ],
    }).compile();

    service = module.get<WorkflowExecutionService>(WorkflowExecutionService);
  });

  it('should call create context', async () => {
    (createExecutionContext as jest.Mock).mockImplementation(() => {
      return getMockExecutionContext();
    });

    (executeStack as jest.Mock).mockImplementation(() => {
      return mockExecutionResult;
    });

    const result = await service.executeWorkflow(
      mockWorkflow,
      [],
      mockWorkflow.triggers[0].id,
    );

    expect(createExecutionContext).toHaveBeenCalledWith([], mockWorkflow);
    expect(executeStack).toHaveBeenCalledWith(
      expect.objectContaining({ isRunning: true }),
      { type: 'mockService' },
    );
    expect(result).toEqual(mockExecutionResult);
  });
  it('should start with items indicated in the trigger', async () => {
    (createExecutionContext as jest.Mock).mockImplementation(() => {
      return getMockExecutionContext();
    });
    (executeStack as jest.Mock).mockImplementation(() => {
      return mockExecutionResult;
    });
    await service.executeWorkflow(
      mockWorkflow,
      [],
      mockWorkflow.triggers[0].id,
    );
    expect(createExecutionContext).toHaveBeenCalledWith([], mockWorkflow);
    expect(executeStack).toHaveBeenCalledWith(
      {
        ...getMockExecutionContext(),
        stack: [mockWorkflow.actionInstances[0]],
      },
      { type: 'mockService' },
    );
  });

  it('should throw when starting with invalid trigger id', async () => {
    (createExecutionContext as jest.Mock).mockImplementation(() => {
      return getMockExecutionContext();
    });
    await expect(
      service.executeWorkflow(mockWorkflow, [], 'invalid'),
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should throw when starting with invalid trigger id', async () => {
    const execContext = getMockExecutionContext();
    (createExecutionContext as jest.Mock).mockImplementation(() => {
      return {
        ...execContext,
        workflow: {
          ...execContext.workflow,
          triggers: [
            { ...execContext.workflow.triggers[0], actions: ['invalid'] },
          ],
        },
      };
    });
    await expect(
      service.executeWorkflow(mockWorkflow, [], mockWorkflow.triggers[0].id),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
});
