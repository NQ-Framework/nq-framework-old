import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { SchedulerService } from './scheduler/scheduler.service';
import { LogJobService } from './handler/log-job/log-job.service';
import { StoredProcedureJobService } from './handler/stored-procedure-job/stored-procedure-job.service';
import { HandlerService } from './handler/handler.service';

@Module({
  imports: [LoggerModule],
  providers: [SchedulerService, LogJobService, StoredProcedureJobService, HandlerService],
  exports: [SchedulerService]
})
export class ScheduledJobsModule { }
