import { Test, TestingModule } from '@nestjs/testing';
import { ConnectorGateway } from '../../gateway/connector.gateway';
import { WorkOrderController } from './work-order.controller';

describe('WorkOrder Controller', () => {
  let controller: WorkOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkOrderController],
      providers: [{ provide: ConnectorGateway, useValue: {} }],
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
