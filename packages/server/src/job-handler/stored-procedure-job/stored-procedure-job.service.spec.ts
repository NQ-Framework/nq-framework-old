import { Test, TestingModule } from '@nestjs/testing';
import { StoredProcedureJobService } from './stored-procedure-job.service';

describe('StoredProcedureJobService', () => {
  let service: StoredProcedureJobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoredProcedureJobService],
    }).compile();

    service = module.get<StoredProcedureJobService>(StoredProcedureJobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    service.ExecuteJob({} as any, { organizationId: 'test id' } as any);
  });
});
