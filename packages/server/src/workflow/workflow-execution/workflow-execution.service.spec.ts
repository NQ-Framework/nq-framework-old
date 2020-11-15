import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowExecutionService } from './workflow-execution.service';

describe('WorkflowExecutionService', () => {
  let service: WorkflowExecutionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkflowExecutionService],
    }).compile();

    service = module.get<WorkflowExecutionService>(WorkflowExecutionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
