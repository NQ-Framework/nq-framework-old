import { Test, TestingModule } from '@nestjs/testing';
import { ActionInstance, ActionResult, Workflow, WorkflowExecutionContext } from '@nqframework/models';
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
        output: []
      },
      action: {
        id: "mock action id",
        isEnabled: true,
        name: 'mock action',
        path: 'mock-path',
        version: 1,
        hasDefaultPort: true
      }
    },
    {
      id: 'mock action instance id 2',
      isEnabled: true,
      configuration: {
        input: [],
        output: []
      },
      action: {
        id: "mock action id",
        isEnabled: true,
        name: 'mock action',
        path: 'mock-path',
        version: 1,
        hasDefaultPort: true
      }
    },
  ],
  actionLinks: [
    {
      fromId: 'mock action instance id',
      toId: 'mock action instance id 2',
      isEnabled: true
    }
  ]
}

const executeActionMock = jest.fn();

describe('WorkflowExecutionService', () => {
  let service: WorkflowExecutionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkflowExecutionService,
        {
          provide: ActionService,
          useValue: { executeAction: executeActionMock }
        }],
    }).compile();

    service = module.get<WorkflowExecutionService>(WorkflowExecutionService);
    executeActionMock.mockClear();
  });

  it('should execute the workflow', async () => {
    executeActionMock.mockImplementation((_, { data }): ActionResult => {
      return {
        data: {
          data: [...data.data, { message: 'test output' }]
        }
      };
    });
    const result = await service.executeWorkflow(mockWorkflow);
    expect(executeActionMock).toHaveBeenCalledWith(mockWorkflow.actionInstances![0], expect.objectContaining({
      isRunning: true
    }));
    expect(result).toEqual({ finalData: { data: [{ message: "test output" }, { message: "test output" }] } });
  });

  it('should handle having undefined action links', async () => {
    executeActionMock.mockImplementation((_, { data }): ActionResult => {
      return {
        data: {
          data: [...data.data, { message: 'test output' }]
        }
      };
    });
    const result = await service.executeWorkflow({ ...mockWorkflow, actionLinks: undefined });
    expect(executeActionMock).toHaveBeenCalledWith(mockWorkflow.actionInstances![0], expect.objectContaining({
      isRunning: true
    }));
    expect(result).toEqual({ finalData: { data: [{ message: "test output" }, { message: "test output" }] } });
  });

  it('workflow without actions should return empty data', async () => {
    const result = await service.executeWorkflow({ ...mockWorkflow, actionInstances: undefined });
    expect(executeActionMock).not.toHaveBeenCalled();
    expect(result).toEqual({ finalData: { data: [] } });
  });
});
