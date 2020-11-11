import { Injectable } from '@nestjs/common';
import { StoredProcedureConfiguration } from '@nqframework/models';
import { BaseJobService } from '../base-job/base-job.service';

@Injectable()
export class StoredProcedureJobService extends BaseJobService {
    ExecuteJob(config: StoredProcedureConfiguration): void {
        console.log("this would execute a sp with: ", JSON.stringify(config));
    }
}
