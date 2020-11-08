import { Test, TestingModule } from '@nestjs/testing';
import { CompanyDataSourceService } from '../../company/company-data-source/company-data-source.service';
import { AnalyticsService } from '../../analytics/analytics.service';
import { LoggerService } from '../../logger/logger.service';
import { RequestRouterService } from './request-router.service';

describe('RequestRouterService', () => {
  let service: RequestRouterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestRouterService, { provide: LoggerService, useValue: {} }, { provide: AnalyticsService, useValue: {} }, { provide: CompanyDataSourceService, useValue: {} }],
    }).compile();

    service = module.get<RequestRouterService>(RequestRouterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
