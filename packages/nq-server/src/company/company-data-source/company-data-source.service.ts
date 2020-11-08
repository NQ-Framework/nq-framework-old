import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class CompanyDataSourceService {
    constructor(private logger: LoggerService) { }

    getCompanyConfiguration(companyId: string) {
        this.logger.debug(`Getting Company Configuration for ${companyId}`)
        return Promise.resolve({
            name: 'NQ Framework',
            id: companyId,
            dataSources: [
                { type: 'sql', handles: ['main-db'], cloudAccessible: true, connectionString: 'sample-conn-string' }
            ],
            employeeIds: ['sQGC1KffuyW9d3tDv6SoaeMo2uc2']
        });
    }
}
