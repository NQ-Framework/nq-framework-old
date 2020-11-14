import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigServiceBase } from './ConfigServiceBase';

@Injectable()
export class AnalyticsConfigService extends ConfigServiceBase {
  constructor(private config: ConfigService) {
    super();
  }

  get measurementId(): string {
    return (
      this.config.get('analytics.measurementId') ??
      this.throwError('measurement id')
    );
  }
  get apiSecret(): string {
    return (
      this.config.get('analytics.apiSecret') ?? this.throwError('api secret')
    );
  }
}
