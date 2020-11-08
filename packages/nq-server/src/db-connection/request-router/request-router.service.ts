import { Injectable } from '@nestjs/common';
import { DataSourceService } from '../../organization/data-source/data-source.service';
import { AnalyticsService } from '../../analytics/analytics.service';
import { LoggerService } from '../../logger/logger.service';
import { DataFetcherFactory } from '@nqframework/data-fetcher';
import { DataFetcher } from '@nqframework/data-fetcher/build/dataFetcherInterface';
@Injectable()
export class RequestRouterService {
  constructor(
    private logger: LoggerService,
    private analytics: AnalyticsService,
    private dataSourceConfig: DataSourceService,
  ) {}

  async getDataFetcher(
    userId: string,
    organizationId: string,
    dataSource: string,
  ): Promise<DataFetcher> {
    this.logger.debug(
      `getting data fetcher for ${userId} ${organizationId} ${dataSource}`,
    );
    if (!dataSource) {
      dataSource = 'main-db';
    }
    const configuration = await this.dataSourceConfig.getDataSourceConfigurations(
      organizationId,
    );
    if (!configuration.members.find((m) => m.uid === userId)) {
      this.logger.warn(
        `Unauthorized attempt to read organization data. Organization Id: ${organizationId} User id: ${userId} data source: ${dataSource} `,
      );
      throw new Error('Unauthorized');
    }

    const dataSourceConfig = configuration.dataSources.find((ds) =>
      ds.handles.includes(dataSource),
    );
    if (!dataSourceConfig) {
      this.logger.error(
        `No data source defined for Organization id: ${organizationId} data source: ${dataSource}`,
      );
      throw new Error('No data source available to fill request');
    }

    if (dataSourceConfig.directAccess) {
      const fetcher = new DataFetcherFactory().create(dataSourceConfig);
      return fetcher;
    }

    throw new Error('An appropriate fetcher could not be obtained.');
  }
}
