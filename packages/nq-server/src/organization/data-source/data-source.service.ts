import { Injectable } from '@nestjs/common';
import { getFirebaseApp } from '../../firebase/initialize';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class DataSourceService {
    constructor(private logger: LoggerService) { }

    async getCompanyConfiguration(companyId: string) {
        this.logger.debug(`Getting Company Configuration for ${companyId}`)
        const app = await getFirebaseApp();
        const snapshot = await app.firestore().collection('companies').get();
        return snapshot.docs;
        // return {
        //     name: 'NQ Framework',
        //     id: companyId,
        //     dataSources: [
        //         { type: 'sql', handles: ['main-db'], cloudAccessible: true, connectionString: 'sample-conn-string' }
        //     ],
        //     employeeIds: ['sQGC1KffuyW9d3tDv6SoaeMo2uc2']
        // };
    }
}
