import { Test, TestingModule } from '@nestjs/testing';
import { DataCredentialsService } from './data-credentials.service';

describe('DataCredentialsService', () => {
  let service: DataCredentialsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataCredentialsService],
    }).compile();

    service = module.get<DataCredentialsService>(DataCredentialsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
