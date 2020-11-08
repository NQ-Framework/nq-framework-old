import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '../../logger/logger.module';
import { CompanyDataSourceService } from './company-data-source.service';

describe('CompanyDataSourceService', () => {
  let service: CompanyDataSourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [CompanyDataSourceService],
    }).compile();

    service = module.get<CompanyDataSourceService>(CompanyDataSourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
