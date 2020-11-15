import { Test, TestingModule } from '@nestjs/testing';
import { ActionInstance } from '@nqframework/models';
import { WorkflowExecutionContext } from '@nqframework/models/build/workflow/workflow-execution-context';
import { ActionService } from './action.service';
import { getHandler } from "./get-handler";
jest.mock("./get-handler");
const getHandlerMock = getHandler as jest.Mock;

describe('ActionService', () => {
  let service: ActionService;
  const mockActionInstance: ActionInstance = {
    action: {
      id: "1",
      isEnabled: true,
      version: 1,
      name: "mock action",
      inputFields: [],
      outputFields: [],
      path: "test-path",
    },
    id: "test id",
    configuration: {
      input: [],
      output: []
    }
  }

  const mockWorkflowExecution: WorkflowExecutionContext = {
    isRunning: true,
    stack: [],
    data: {
      data: [],
      binaryData: []
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActionService],
    }).compile();

    service = module.get<ActionService>(ActionService);
  });

  it('should execute passed action', async () => {
    getHandlerMock.mockImplementation(() => ({
      handle: () => ({ test: "ok" })
    }));
    const result = await service.executeAction(mockActionInstance, mockWorkflowExecution);
    expect(getHandlerMock).toHaveBeenCalledWith(mockActionInstance.action);
    expect(result).toEqual({ test: "ok" });
  });
});
