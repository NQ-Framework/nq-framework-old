import { Injectable } from '@nestjs/common';
import { Action } from '@nqframework/models';
import { getFirebaseApp } from '../../firebase/initialize';

@Injectable()
export class ActionsRepositoryService {
  async getAll(): Promise<Action[]> {
    const app = await getFirebaseApp();
    const actions = await app
      .firestore()
      .collection('actions')
      .where('isEnabled', '==', true)
      .get();
    return actions.docs.map((d) => ({ id: d.id, ...d.data() })) as Action[];
  }
}
