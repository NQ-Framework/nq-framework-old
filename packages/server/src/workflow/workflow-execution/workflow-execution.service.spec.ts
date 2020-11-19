import { Test, TestingModule } from '@nestjs/testing';
import { ActionResult } from '@nqframework/models';
import { ActionService } from '../../actions/action.service';
import { mockWorkflow } from '../mocks/mock-workflow';
import { WorkflowExecutionService } from './workflow-execution.service';

const executeActionMock = jest.fn();

describe('WorkflowExecutionService', () => {
  let service: WorkflowExecutionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkflowExecutionService,
        {
          provide: ActionService,
          useValue: { executeAction: executeActionMock },
        },
      ],
    }).compile();

    service = module.get<WorkflowExecutionService>(WorkflowExecutionService);
    executeActionMock.mockClear();
  });

  it('should execute the workflow', async () => {
    executeActionMock.mockImplementation(
      (): ActionResult => {
        return {
          propertyValues: [
            {
              name: 'message',
              value: 'test value',
            },
          ],
          outputValues: [{ name: 'message', value: 'test value' }],
        };
      },
    );
    const result = await service.executeWorkflow(mockWorkflow, []);
    expect(executeActionMock).toHaveBeenNthCalledWith(
      1,
      mockWorkflow.actionInstances[1],
      expect.objectContaining({
        isRunning: true,
      }),
    );
    expect(result).toEqual({
      data: {
        'mock action instance id': {
          values: { message: 'test value' },
          properties: { message: 'test value' },
        },
        'mock action instance id 2': {
          values: { message: 'test value' },
          properties: { message: 'test value' },
        },
      },
      finalOutput: {
        message: 'test value',
      },
    });
  });

  it('should handle having undefined action links', async () => {
    executeActionMock.mockImplementation(
      (): ActionResult => {
        return {
          propertyValues: [
            {
              name: 'message',
              value: 'test value',
            },
          ],
          outputValues: [],
        };
      },
    );
    const result = await service.executeWorkflow(
      {
        ...mockWorkflow,
        actionLinks: undefined as any,
      },
      [],
    );
    expect(executeActionMock).toHaveBeenCalledWith(
      mockWorkflow.actionInstances[0],
      expect.objectContaining({
        isRunning: true,
      }),
    );
    expect(result).toEqual({
      data: {
        'mock action instance id': {
          values: {},
          properties: { message: 'test value' },
        },
        'mock action instance id 2': {
          values: {},
          properties: { message: 'test value' },
        },
      },
      finalOutput: {},
    });
  });

  it('workflow without actions should throw', async () => {
    await expect(
      service.executeWorkflow(
        {
          ...mockWorkflow,
          actionInstances: undefined as any,
        },
        [],
      ),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
});
