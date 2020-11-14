import { Module } from '@nestjs/common';
import { TriggerController } from './trigger/trigger.controller';
import { JobsService } from './jobs/jobs.service';
import { LoggerModule } from '../logger/logger.module';
import { JobHandlerModule } from '../job-handler/job-handler.module';

@Module({
  imports: [LoggerModule, JobHandlerModule],
  controllers: [TriggerController],
  providers: [JobsService],
})
export class TriggeredJobsModule { }
