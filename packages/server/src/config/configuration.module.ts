import { Module } from '@nestjs/common';
import { AnalyticsConfigService } from './AnalyticsConfigService';
import { AuthConfigService } from './AuthConfigService';

@Module({
  providers: [AuthConfigService, AnalyticsConfigService],
  exports: [AuthConfigService, AnalyticsConfigService],
})
export class ConfiugrationModule {}
