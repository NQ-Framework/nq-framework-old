import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from '../core/logger.service';
import { WorkflowService } from './workflow.service';
import { getFirebaseApp } from '../firebase/initialize';

jest.mock('../firebase/initialize');
const getFbAppMock = getFirebaseApp as jest.Mock;

getFbAppMock.mockImplementation(() => ({
  firestore: () => ({
    collection: () => {
      return {
        where: (_: any, __: any, value: string) => {
          expect(value).toEqual('test org id');
          return {
            get: () => ({
              docs: [
                {
                  id: 'mock id',
                  data: () => ({
                    name: 'mock name',
                    organizationId: 'test org id',
                  }),
                },
              ],
            }),
          };
        },
      };
    },
  }),
}));

describe('WorkflowService', () => {
  let service: WorkflowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkflowService,
        {
          provide: LoggerService,
          useValue: { debug: jest.fn(), setContext: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<WorkflowService>(WorkflowService);
  });

  it('should call firebase for workflows and add doc id', async () => {
    const workflows = await service.getWorkflowsForOrganization('test org id');
    expect(workflows.length).toEqual(1);
    expect(workflows[0].id).toEqual('mock id');
  });
});
