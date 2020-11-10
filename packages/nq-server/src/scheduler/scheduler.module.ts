import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { SchedulerService } from './scheduler/scheduler.service';

@Module({
  imports: [LoggerModule],
  providers: [SchedulerService],
  exports: [SchedulerService]
})
export class SchedulerModule { }
