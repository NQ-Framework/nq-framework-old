import { Test, TestingModule } from '@nestjs/testing';
import { LogJobService } from './log-job.service';

describe('LogJobService', () => {
  let service: LogJobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogJobService],
    }).compile();

    service = module.get<LogJobService>(LogJobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    service.ExecuteJob({ message: 'test' } as any);
  });
});
