import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { HandlerService } from './handler.service';
import { LogJobService } from './log-job/log-job.service';
import { StoredProcedureJobService } from './stored-procedure-job/stored-procedure-job.service';

@Module({
    imports: [LoggerModule],
    providers: [HandlerService, LogJobService, StoredProcedureJobService],
    exports: [HandlerService]
})
export class JobHandlerModule {
}
