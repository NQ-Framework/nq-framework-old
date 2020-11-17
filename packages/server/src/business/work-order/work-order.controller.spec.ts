import { Test, TestingModule } from '@nestjs/testing';
import { CoreModule } from '../../core/core.module';
import { RequestRouterService } from '../../db-connection/request-router/request-router.service';
import { WorkOrderController } from './work-order.controller';
import { WorkflowService } from '../../workflow/workflow.service';
import { WorkflowExecutionService } from '../../workflow/workflow-execution/workflow-execution.service';

describe('WorkOrder Controller', () => {
  let controller: WorkOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CoreModule],
      controllers: [WorkOrderController],
      providers: [
        { provide: RequestRouterService, useValue: {} },
        {
          provide: WorkflowService,
          useValue: {},
        },
        {
          provide: WorkflowExecutionService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<WorkOrderController>(WorkOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // it('should return error if no connector found', () => {
  //   const result = controller.getWorkOrders();
  // });
});
