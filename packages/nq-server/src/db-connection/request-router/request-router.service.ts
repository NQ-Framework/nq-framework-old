import { Injectable } from '@nestjs/common';
import { CompanyDataSourceService } from '../../company/company-data-source/company-data-source.service';
import { AnalyticsService } from '../../analytics/analytics.service';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class RequestRouterService {

    constructor(private logger: LoggerService, private analytics: AnalyticsService, private companyConfig: CompanyDataSourceService) {
    }

    async getDataFetcher(userId: string, companyId: string, dataSource: string): Promise<{ getData: () => Promise<string> }> {
        this.logger.debug(`getting data fetcher for ${userId} ${companyId} ${dataSource}`)
        if (!dataSource) {
            dataSource = 'main-db';
        }
        const configuration = await this.companyConfig.getCompanyConfiguration(companyId);
        if (!configuration.employeeIds.includes(userId)) {
            this.logger.warn(`Unauthorized attempt to ready company data. Company Id: ${companyId} User id: ${userId} data source: ${dataSource} `)
            throw new Error('Unauthorized');
        }

        const dataSourceConfig = configuration.dataSources.find(ds => ds.type === 'sql' && ds.handles.includes(dataSource));
        if (!dataSourceConfig) {
            this.logger.error(`No data source defined for Company id: ${companyId} data source: ${dataSource}`)
            throw new Error('No data source available to fill request')
        }

        const fetcher = await this.createFetcher(dataSourceConfig);

        return fetcher;
    }

    async createFetcher(config: any): Promise<{ getData(): Promise<string> }> {
        return {
            getData: () => Promise.resolve('sample data')
        }
    }
}
