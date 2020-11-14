import { Injectable } from '@nestjs/common';
import { getFirebaseApp } from '../../firebase/initialize';
import { LoggerService } from '../../logger/logger.service';
import { OrganizationMember, DataSource } from '@nqframework/models';

@Injectable()
export class DataSourceService {
  constructor(private logger: LoggerService) {}

  async getDataSourceConfigurations(
    organizationId: string,
  ): Promise<{ members: OrganizationMember[]; dataSources: DataSource[] }> {
    this.logger.debug(
      `Getting Data Source Configuration for ${organizationId}`,
    );
    const app = await getFirebaseApp();
    const document = await app
      .firestore()
      .doc(`organizations/${organizationId}`)
      .get();
    if (!document.exists) {
      this.logger.warn(
        `Looking up configuration for non existant organization: ${organizationId}`,
      );
      throw new Error('Invalid organization id');
    }
    const data = document.data() as FirebaseFirestore.DocumentData;
    return { members: data.members, dataSources: data.dataSources };
  }
}
