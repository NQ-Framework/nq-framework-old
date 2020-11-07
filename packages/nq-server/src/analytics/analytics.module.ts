import { HttpModule, Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { ConfiugrationModule } from '../config/configuration.module';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [HttpModule, ConfiugrationModule, LoggerModule],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
