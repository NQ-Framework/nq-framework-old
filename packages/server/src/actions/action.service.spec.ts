import { Test, TestingModule } from '@nestjs/testing';
import { ActionInstance } from '@nqframework/models';
import { WorkflowExecutionContext } from '@nqframework/models';
import { mockOrganization } from '../workflow/mocks/mock-organization';
import { ActionService } from './action.service';
import { getHandler } from './get-handler';
jest.mock('./get-handler');
const getHandlerMock = getHandler as jest.Mock;

describe('ActionService', () => {
  let service: ActionService;
  const mockActionInstance: ActionInstance = {
    isEnabled: true,
    editorConfig: {
      color: '#000000',
      x: 100,
      y: 100,
    },
    action: {
      id: '1',
      hasDefaultPort: true,
      isEnabled: true,
      version: 1,
      name: 'mock action',
      properties: [],
      outputFields: [],
      path: 'test-path',
    },
    name: 'test id',
    configuration: {
      input: [],
    },
  };

  const mockWorkflowExecution: WorkflowExecutionContext = {
    startTime: new Date(),
    id: 'mock id',
    startedBy: 'mock user id',
    organization: mockOrganization,
    isRunning: true,
    workflow: {} as any,
    stack: [],
    input: [],
    triggerInput: [],
    actions: {},
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActionService],
    }).compile();

    service = module.get<ActionService>(ActionService);
  });

  it('should execute passed action', async () => {
    getHandlerMock.mockImplementation(() => ({
      handle: () => [{ name: 'test', value: 'ok' }],
    }));
    const result = await service.executeAction(
      mockActionInstance,
      mockWorkflowExecution,
    );
    expect(getHandlerMock).toHaveBeenCalledWith(mockActionInstance.action);
    expect(result).toEqual({
      outputValues: [{ name: 'test', value: 'ok' }],
      propertyValues: [],
    });
  });

  it('should ignore empty valued inputs', async () => {
    const executeMock = jest.fn();
    getHandlerMock.mockImplementation(() => ({
      handle: executeMock,
    }));
    const result = await service.executeAction(
      {
        ...mockActionInstance,
        configuration: {
          ...mockActionInstance.configuration,
          input: [{ name: 'test prop', value: '' }],
        },
      },
      mockWorkflowExecution,
    );
    expect(executeMock).toHaveBeenCalledWith(
      [],
      expect.any(Object),
      expect.any(Object),
      expect.any(Object),
    );
  });

  it('should include fixed input values', async () => {
    const executeMock = jest.fn();
    getHandlerMock.mockImplementation(() => ({
      handle: executeMock,
    }));
    const result = await service.executeAction(
      {
        ...mockActionInstance,
        configuration: {
          ...mockActionInstance.configuration,
          input: [{ name: 'test prop', value: 'test value' }, { name: "test falsy", value: false }],
        },
      },
      mockWorkflowExecution,
    );
    expect(executeMock).toHaveBeenCalledWith(
      [{ name: 'test prop', value: 'test value' }, { name: 'test falsy', value: false }],
      expect.any(Object),
      expect.any(Object),
      expect.any(Object),
    );
  });

  it('should evaluate input expressions', async () => {
    const executeMock = jest.fn();
    getHandlerMock.mockImplementation(() => ({
      handle: executeMock,
    }));
    const result = await service.executeAction(
      {
        ...mockActionInstance,
        configuration: {
          ...mockActionInstance.configuration,
          input: [{ name: 'test prop', value: '="test value".toUpperCase();' }],
        },
      },
      mockWorkflowExecution,
    );
    expect(executeMock).toHaveBeenCalledWith(
      [{ name: 'test prop', value: 'TEST VALUE' }],
      expect.any(Object),
      expect.any(Object),
      expect.any(Object),
    );
  });
});
