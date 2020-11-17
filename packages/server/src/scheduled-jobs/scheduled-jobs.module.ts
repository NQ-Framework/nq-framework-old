import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { SchedulerService } from './scheduler/scheduler.service';
import { JobsService } from './jobs/jobs.service';
import { JobHandlerModule } from 'src/job-handler/job-handler.module';

@Module({
  imports: [CoreModule, JobHandlerModule],
  providers: [SchedulerService, JobsService],
  exports: [SchedulerService],
})
export class ScheduledJobsModule { }
