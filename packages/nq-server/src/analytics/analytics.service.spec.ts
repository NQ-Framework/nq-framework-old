import { HttpModule, HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from '../logger/logger.service';
import { AnalyticsConfigService } from '../config/AnalyticsConfigService';
import { AnalyticsService } from './analytics.service';
import { of } from 'rxjs';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let httpService: HttpService;

  // const result: any = {
  //   data: {
  //     name: 'Jane Doe',
  //     grades: [3.7, 3.8, 3.9, 4.0, 3.6],
  //   },
  //   status: 200,
  //   statusText: 'OK',
  //   headers: {},
  //   config: {},
  // };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: AnalyticsConfigService,
          useValue: { measurementId: 'test id' },
        },
        {
          provide: LoggerService,
          useClass: LoggerService,
        },
      ],
      imports: [HttpModule],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should send events', async () => {
    const spy = jest
      .spyOn(httpService, 'post')
      .mockImplementation(() =>
        of({ status: 200, data: 'response data' } as any),
      );
    const event = { events: [{ name: 'item_view' }] };
    const response = service.trackEvent('asd', event);
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('google-analytics'),
      expect.objectContaining({ events: [{ name: 'item_view' }] }),
      expect.objectContaining({ params: { measurement_id: 'test id' } }),
    );
    expect(response.then).toBeDefined();
  });
});
