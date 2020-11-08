import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '../../logger/logger.module';
import { DataSourceService } from './data-source.service';

describe('DataSourceService', () => {
  let service: DataSourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [DataSourceService],
    }).compile();

    service = module.get<DataSourceService>(DataSourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
