import { Injectable } from '@nestjs/common';
import { Organization } from '@nqframework/models';
import { getFirebaseApp } from '../firebase/initialize';

@Injectable()
export class OrganizationService {
  async getOrganizationsForUserId(userId: string): Promise<Organization[]> {
    const app = await getFirebaseApp();
    const organizations = await app
      .firestore()
      .collection('organizations')
      .where('memberIds', 'array-contains', userId)
      .get();
    return organizations.docs.map((d) => ({ ...d.data() })) as Organization[];
  }
}
