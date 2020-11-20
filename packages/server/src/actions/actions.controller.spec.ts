import { Test, TestingModule } from '@nestjs/testing';
import { ActionsRepositoryService } from './actions-repository/actions-repository.service';
import { ActionsController } from './actions.controller';
import { mockActions } from './mock/mockAcktions';

describe('ActionsController', () => {
  let controller: ActionsController;
  let service: ActionsRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActionsController],
      providers: [
        { provide: ActionsRepositoryService, useValue: { getAll: jest.fn() } },
      ],
    }).compile();

    controller = module.get<ActionsController>(ActionsController);
    service = module.get<ActionsRepositoryService>(ActionsRepositoryService);
  });

  it('should be defined', async () => {
    const mock = service.getAll as jest.Mock;
    mock.mockImplementation(() => mockActions);
    const result = await controller.getAll();
    expect(result).toEqual(mockActions);
    expect(mock).toHaveBeenCalled();
  });
});
