import { Injectable } from '@nestjs/common';
import { DataCredentialsType } from '@nqframework/models';
import { getFirebaseApp } from '../../firebase/initialize';

@Injectable()
export class DataCredentialsService {
  async getCredentialTypes(): Promise<DataCredentialsType[]> {
    const app = await getFirebaseApp();
    const typesColl = await app
      .firestore()
      .collection('dataCredentialsTypes')
      .get();
    return typesColl.docs.map((d) => d.data()) as DataCredentialsType[];
  }

  async createCredentialType(newType: DataCredentialsType): Promise<void> {
    const app = await getFirebaseApp();
    const existingDoc = await app
      .firestore()
      .doc(`dataCredentialsTypes/${newType.type}`)
      .get();
    if (existingDoc.exists) {
      throw new Error('credentials type already exists!');
    }
    await app
      .firestore()
      .collection('dataCredentialsTypes')
      .doc(newType.type)
      .create(newType);
  }
}
