import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../core/logger.service';
import {
  DataFetcherFactory,
  DataFetcherInterface,
} from '@nqframework/data-fetcher';
import { OrganizationService } from '../../organization/organization.service';
@Injectable()
export class RequestRouterService {
  constructor(
    private logger: LoggerService,
    private organizationService: OrganizationService,
  ) {}

  async getDataFetcher(
    userId: string,
    organizationId: string,
    credentialsName: string,
  ): Promise<DataFetcherInterface> {
    this.logger.debug(
      `getting data fetcher for ${userId} ${organizationId} ${credentialsName}`,
    );

    const organization = await this.organizationService.getOrganization(
      organizationId,
    );
    if (!organization || !organization.members.find((m) => m.uid === userId)) {
      this.logger.warn(
        `Unauthorized attempt to read organization data. Organization Id: ${organizationId} User id: ${userId} credentials name: ${credentialsName} `,
      );
      throw new Error('Unauthorized');
    }

    const credentials = organization.dataCredentials.find(
      (dc) => dc.name === credentialsName,
    );
    if (!credentials) {
      this.logger.error(
        `No credentials with name ${credentialsName} found for Organization id: ${organizationId}`,
      );
      throw new Error('No credentials available to fill request');
    }

    if (!credentials.isRemote) {
      const fetcher = new DataFetcherFactory().create(
        credentials.credentialsType.type,
        credentials.configuration,
      );
      return fetcher;
    }

    throw new Error('An appropriate fetcher could not be obtained.');
  }
}
