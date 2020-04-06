import { Test, TestingModule } from '@nestjs/testing';
import { ActionsController } from './actions.controller';
import { AuthConfigService } from '../config/AuthConfigService';

describe('Actions Controller', () => {
  let controller: ActionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActionsController],
      providers: [{ provide: AuthConfigService, useValue: {} }],
    }).compile();

    controller = module.get<ActionsController>(ActionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
