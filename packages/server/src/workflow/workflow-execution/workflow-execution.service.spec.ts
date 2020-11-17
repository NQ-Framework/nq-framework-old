import { Test, TestingModule } from '@nestjs/testing';
import {
  ActionResult,
  Workflow,
} from '@nqframework/models';
import { ActionService } from '../../actions/action.service';
import { WorkflowExecutionService } from './workflow-execution.service';

const mockWorkflow: Workflow = {
  id: 'mock id',
  isActive: true,
  name: 'mock workflow',
  organizationId: 'mock org id',
  actionInstances: [
    {
      id: 'mock action instance id',
      isEnabled: true,
      configuration: {
        input: [],
      },
      action: {
        id: 'mock action id',
        isEnabled: true,
        name: 'mock action',
        path: 'mock-path',
        version: 1,
        hasDefaultPort: true,
      },
    },
    {
      id: 'mock action instance id 2',
      isEnabled: true,
      configuration: {
        input: [],
      },
      action: {
        id: 'mock action id',
        isEnabled: true,
        name: 'mock action',
        path: 'mock-path',
        version: 1,
        hasDefaultPort: true,
      },
    },
  ],
  actionLinks: [
    {
      fromId: 'mock action instance id',
      toId: 'mock action instance id 2',
      isEnabled: true,
    },
  ],
};

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
        return ({
          propertyValues:
            [{
              name: 'message', value: 'test value'
            }],
          outputValues: [{ name: 'message', value: 'test value' }]
        }
        );
      },
    );
    const result = await service.executeWorkflow(mockWorkflow);
    expect(executeActionMock).toHaveBeenNthCalledWith(1,
      mockWorkflow.actionInstances![0],
      expect.objectContaining({
        isRunning: true,
      }),
    );
    expect(result).toEqual({
      finalData:
        { 'mock action instance id': { values: { message: 'test value' }, properties: { message: 'test value' } }, 'mock action instance id 2': { values: { message: 'test value' }, properties: { message: 'test value' } } }
      ,
    });
  });

  it('should handle having undefined action links', async () => {
    executeActionMock.mockImplementation(
      (): ActionResult => {
        return ({
          propertyValues:
            [{
              name: 'message', value: 'test value'
            }],
          outputValues: []
        });
      },
    );
    const result = await service.executeWorkflow({
      ...mockWorkflow,
      actionLinks: undefined,
    });
    expect(executeActionMock).toHaveBeenCalledWith(
      mockWorkflow.actionInstances![0],
      expect.objectContaining({
        isRunning: true,
      }),
    );
    expect(result).toEqual({
      finalData:
        { 'mock action instance id': { values: {}, properties: { message: 'test value' } }, 'mock action instance id 2': { values: {}, properties: { message: 'test value' } } }
      ,
    });
  });

  it('workflow without actions should return empty data', async () => {
    const result = await service.executeWorkflow({
      ...mockWorkflow,
      actionInstances: undefined,
    });
    expect(executeActionMock).not.toHaveBeenCalled();
    expect(result).toEqual({ finalData: {} });
  });
});
