import { HttpModule, Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { ConfiugrationModule } from '../config/configuration.module';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [HttpModule, ConfiugrationModule, CoreModule],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
