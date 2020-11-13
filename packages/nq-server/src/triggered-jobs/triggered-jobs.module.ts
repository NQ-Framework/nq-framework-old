import { Module } from '@nestjs/common';
import { TriggerController } from './trigger/trigger.controller';
import { JobsService } from './jobs/jobs.service';

@Module({
  controllers: [TriggerController],
  providers: [JobsService],
})
export class TriggeredJobsModule { }
