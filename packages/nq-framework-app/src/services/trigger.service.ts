import {
  Workflow,
  WorkflowTrigger,
  WorkflowTriggerBase,
} from '@nqframework/models';
import { getUserToken } from './get-user-token';

const url = process.env.REACT_APP_API_URL;
export class TriggerService {
  async getAllTriggerDefinitions(
    organizationId: string,
  ): Promise<WorkflowTrigger[]> {
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

  async createTrigger(
    organizationId: string,
    workflowId: string,
    trigger: WorkflowTriggerBase,
  ): Promise<Workflow[]> {
    const res = await fetch(
      url + `/workflow/${workflowId}/triggers?organizationId=${organizationId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${await getUserToken()}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify(trigger),
      },
    );
    if (res.status !== 201) {
      throw new Error('not found');
    }
    const data = await res.json();
    return data;
  }

  async updateTrigger(
    organizationId: string,
    workflowId: string,
    triggerId: string,
    trigger: WorkflowTriggerBase,
  ): Promise<Workflow[]> {
    const res = await fetch(
      url +
        `/workflow/${workflowId}/triggers/${triggerId}?organizationId=${organizationId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${await getUserToken()}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify(trigger),
      },
    );
    if (res.status !== 200) {
      throw new Error('not found');
    }
    const data = await res.json();
    return data;
  }
  async deleteTrigger(
    organizationId: string,
    workflowId: string,
    triggerId: string,
  ): Promise<Workflow[]> {
    const res = await fetch(
      url +
        `/workflow/${workflowId}/triggers/${triggerId}?organizationId=${organizationId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${await getUserToken()}`,
        },
      },
    );
    if (res.status !== 200) {
      throw new Error('not found');
    }
    const data = await res.json();
    return data;
  }
}
