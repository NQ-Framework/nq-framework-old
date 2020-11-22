import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowController } from './workflow.controller';
import { WorkflowRepositoryService } from './workflow-repository.service';
import { ActionsRepositoryService } from '../actions/actions-repository/actions-repository.service';

describe('WorkflowController', () => {
  let controller: WorkflowController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkflowController],
      providers: [
        { provide: WorkflowRepositoryService, useValue: {} },
        { provide: ActionsRepositoryService, useValue: {} },
      ],
    }).compile();

    controller = module.get<WorkflowController>(WorkflowController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
