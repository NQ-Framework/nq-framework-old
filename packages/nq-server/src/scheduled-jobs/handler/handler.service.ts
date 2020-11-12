import { Injectable } from '@nestjs/common';
import { ConfigurationInterface } from '@nqframework/models';
import { BaseJobService } from './base-job/base-job.service';
import { LogJobService } from "./log-job/log-job.service";
import { StoredProcedureJobService } from './stored-procedure-job/stored-procedure-job.service';


@Injectable()
export class HandlerService {
    map: any = {};
    constructor(logJob: LogJobService, storedProcedureJob: StoredProcedureJobService) {
        this.map['log'] = logJob;
        this.map['stored-procedure'] = storedProcedureJob;
    }

    GetHandlerFromConfig(config: ConfigurationInterface): BaseJobService | null {
        const handler = this.map[config.type];
        return handler ? handler : null;
    }
}
