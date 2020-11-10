import { HttpService, Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { AnalyticsConfigService } from '../config/AnalyticsConfigService';
import { AnalyticsEvent } from './event.model';

@Injectable()
export class AnalyticsService {
  constructor(
    private httpService: HttpService,
    private config: AnalyticsConfigService,
    private logger: LoggerService,
  ) {
    logger.setContext('Analytics');
  }

  trackEvent(userId: string, event: AnalyticsEvent): Promise<any> {
    this.logger.debug(
      'sending event to ' +
      userId +
      '... ' +
      JSON.stringify(event) +
      ' using measurement id: ' +
      this.config.measurementId,
    );
    const data = {
      'client_id': userId,
      events: event.events,
    };
    return this.httpService
      .post('https://www.google-analytics.com/mp/collect', data, {
        params: {
          'measurement_id': this.config.measurementId,
          'api_secret': this.config.apiSecret,
        },
        headers: {
          'content-type': 'application/json',
        },
      })
      .toPromise()
      .then((resp) => {
        this.logger.debug(
          'analytics response ' +
          JSON.stringify(resp.status) +
          ' data: ' +
          JSON.stringify(resp.data),
        );
      });
  }
}
