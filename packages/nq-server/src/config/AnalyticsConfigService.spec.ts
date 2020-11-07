import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsConfigService } from './AnalyticsConfigService';
import { ConfigService } from '@nestjs/config';

describe('AnalyticsConfigService', () => {
  let service: AnalyticsConfigService;

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsConfigService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AnalyticsConfigService>(AnalyticsConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should get settings from config service', () => {
    mockConfigService.get.mockReturnValue('test value');
    expect(service.measurementId).toEqual('test value');
    expect(service.apiSecret).toEqual('test value');
  })

  it('should throw on missing configuration', () => {
    mockConfigService.get.mockReturnValue(undefined);
    expect(() => {
      service.measurementId;
    }).toThrowErrorMatchingSnapshot();
    expect(() => {
      service.apiSecret;
    }).toThrowErrorMatchingSnapshot();
  });
});
