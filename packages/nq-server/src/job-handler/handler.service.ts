import { Injectable } from '@nestjs/common';
import { ConfigurationInterface, ScheduledJob, TriggeredJob } from '@nqframework/models';
import { LoggerService } from '../logger/logger.service';
import { BaseJobService } from './base-job/base-job.service';
import { LogJobService } from './log-job/log-job.service';
import { StoredProcedureJobService } from './stored-procedure-job/stored-procedure-job.service';

@Injectable()
export class HandlerService {
  map: any = {};
  constructor(
    private logger: LoggerService,
    logJob: LogJobService,
    storedProcedureJob: StoredProcedureJobService,
  ) {
    this.map['log'] = logJob;
    this.map['stored-procedure'] = storedProcedureJob;
  }

  getHandlerFromConfig(config: ConfigurationInterface): BaseJobService | null {
    const handler = this.map[config.type];
    return handler ? handler : null;
  }


  async executeJob(job: ScheduledJob | TriggeredJob): Promise<{ data: any }> {
    const handler = await this.getHandlerFromConfig(job.configuration);
    if (!handler) {
      this.logger.error(`Handler not found for job ${JSON.stringify(job)}`)
      throw new Error(`handler not found for job`)
    }
    const result = await handler.ExecuteJob(job.configuration, job);
    return { data: result };
  }
}
