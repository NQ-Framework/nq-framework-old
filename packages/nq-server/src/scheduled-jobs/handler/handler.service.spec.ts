import { Test, TestingModule } from '@nestjs/testing';
import { HandlerService } from './handler.service';
import { LogJobService } from './log-job/log-job.service';
import { StoredProcedureJobService } from './stored-procedure-job/stored-procedure-job.service';

describe('HandlerService', () => {
  let service: HandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HandlerService,
        { provide: LogJobService, useValue: {} },
        { provide: LogJobService, useValue: {} },
        { provide: StoredProcedureJobService, useValue: {} }],
    }).compile();

    service = module.get<HandlerService>(HandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
