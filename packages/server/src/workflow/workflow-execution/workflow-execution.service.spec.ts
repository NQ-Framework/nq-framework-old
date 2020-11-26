import { Test, TestingModule } from '@nestjs/testing';
import { mockWorkflow } from '../mocks/mock-workflow';
import { WorkflowExecutionService } from './workflow-execution.service';
import { createExecutionContext } from './create-execution-context';
import { ActionService } from '../../actions/action.service';
import { getMockExecutionContext } from '../mocks/get-mock-execution-context';
import { executeStack } from './execute-stack';
import { mockExecutionResult } from '../mocks/mock-execution-result';
import { OrganizationService } from '../../organization/organization.service';
import { mockOrganization } from '../mocks/mock-organization';

jest.mock('./create-execution-context');
jest.mock('./execute-stack');

describe('WorkflowExecutionService', () => {
  let service: WorkflowExecutionService;
  let organizationService: OrganizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkflowExecutionService,
        { provide: ActionService, useValue: { type: 'mockService' } },
        {
          provide: OrganizationService,
          useValue: { getOrganization: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<WorkflowExecutionService>(WorkflowExecutionService);
    organizationService = module.get<OrganizationService>(OrganizationService);
  });

  it('should call create context', async () => {
    const mock = organizationService.getOrganization as jest.Mock;
    mock.mockImplementation(() => mockOrganization);
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
      "mock user id"
    );

    expect(createExecutionContext).toHaveBeenCalledWith(
      [],
      mockWorkflow,
      mockOrganization,
      "mock user id"
    );
    expect(executeStack).toHaveBeenCalledWith(
      expect.objectContaining({ isRunning: true }),
      { type: 'mockService' },
    );
    expect(result).toEqual(mockExecutionResult);
  });
  it('should start with items indicated in the trigger', async () => {
    const mockOrg = organizationService.getOrganization as jest.Mock;
    mockOrg.mockImplementation(() => mockOrganization);
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
      "mock user id"
    );
    expect(createExecutionContext).toHaveBeenCalledWith(
      [],
      mockWorkflow,
      mockOrganization,
      "mock user id"
    );
    expect(executeStack).toHaveBeenCalledWith(
      {
        ...getMockExecutionContext(),
        stack: [mockWorkflow.actionInstances[0]],
      },
      { type: 'mockService' },
    );
    expect(mockOrg).toHaveBeenCalledWith(mockWorkflow.organizationId);
  });

  it('should throw when starting with invalid trigger id', async () => {
    const mockOrg = organizationService.getOrganization as jest.Mock;
    mockOrg.mockImplementation(() => mockOrganization);
    (createExecutionContext as jest.Mock).mockImplementation(() => {
      return getMockExecutionContext();
    });
    await expect(
      service.executeWorkflow(mockWorkflow, [], 'invalid', "mock user id"),
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should throw when starting with invalid trigger id', async () => {
    const mockOrg = organizationService.getOrganization as jest.Mock;
    mockOrg.mockImplementation(() => mockOrganization);
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
      service.executeWorkflow(mockWorkflow, [], mockWorkflow.triggers[0].id, "mock user id"),
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should throw when starting with invalid organization id', async () => {
    const mockOrg = organizationService.getOrganization as jest.Mock;
    mockOrg.mockImplementation(() => null);
    await expect(
      service.executeWorkflow(mockWorkflow, [], mockWorkflow.triggers[0].id, "mock user id"),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
});
