import { Injectable } from '@nestjs/common';
import {
  ScheduledJob,
  StoredProcedureConfiguration,
} from '@nqframework/models';
import { BaseJobService } from '../base-job/base-job.service';

@Injectable()
export class StoredProcedureJobService extends BaseJobService {
  ExecuteJob(config: StoredProcedureConfiguration, job: ScheduledJob): void {
    console.log(
      'this would execute a job called ' + job.name + 'sp for org ' + job.organizationId + ' with: ',
      JSON.stringify(config),
    );
  }
}
