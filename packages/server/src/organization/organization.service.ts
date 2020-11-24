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

  async getOrganization(organizationId: string): Promise<Organization | null> {
    const app = await getFirebaseApp();
    const organization = await app
      .firestore()
      .doc(`organizations/${organizationId}`)
      .get();
    return organization.exists ? organization.data() as Organization : null;
  }

  async updateOrganization(organization: Organization): Promise<void> {
    const app = await getFirebaseApp();
    await app
      .firestore()
      .doc(`organizations/${organization.name}`)
      .update(organization);
  }
}
