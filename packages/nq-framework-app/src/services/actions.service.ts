import { Action, WorkflowTrigger } from '@nqframework/models';
import { getUserToken } from './get-user-token';

const url = process.env.REACT_APP_API_URL;
export class ActionsService {
  async getAll(organizationId: string): Promise<Action[]> {
    const token = await getUserToken();
    const res = await fetch(url + `/actions?organizationId=${organizationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return data;
  }
  async getAllTriggers(organizationId: string): Promise<WorkflowTrigger[]> {
    const token = await getUserToken();
    const res = await fetch(
      url + `/actions/triggers?organizationId=${organizationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await res.json();
    return data;
  }
}
