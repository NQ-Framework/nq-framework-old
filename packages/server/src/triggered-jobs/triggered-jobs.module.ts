import { Module } from '@nestjs/common';
import { TriggerController } from './trigger/trigger.controller';
import { JobsService } from './jobs/jobs.service';
import { CoreModule } from '../core/core.module';
import { JobHandlerModule } from '../job-handler/job-handler.module';

@Module({
  imports: [CoreModule, JobHandlerModule],
  controllers: [TriggerController],
  providers: [JobsService],
})
export class TriggeredJobsModule {}
