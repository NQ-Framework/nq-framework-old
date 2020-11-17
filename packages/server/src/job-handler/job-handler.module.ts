import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { HandlerService } from './handler.service';
import { LogJobService } from './log-job/log-job.service';
import { StoredProcedureJobService } from './stored-procedure-job/stored-procedure-job.service';

@Module({
  imports: [CoreModule],
  providers: [HandlerService, LogJobService, StoredProcedureJobService],
  exports: [HandlerService],
})
export class JobHandlerModule {}
