import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from '../../scheduled-jobs/jobs/jobs.service';
import { LoggerModule } from '../../logger/logger.module';
import { TriggerController } from './trigger.controller';
import { HandlerService } from '../../job-handler/handler.service';

describe('TriggerController', () => {
  let controller: TriggerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [TriggerController],
      providers: [
        { provide: JobsService, useValue: {} },
        { provide: HandlerService, useValue: {} }
      ]
    }).compile();

    controller = module.get<TriggerController>(TriggerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
