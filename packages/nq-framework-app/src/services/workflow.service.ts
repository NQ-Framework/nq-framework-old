import { PropertyValue, Workflow } from '@nqframework/models';
import { UpdateNodePositions } from '../types/UpdateNodePositions';
import { getUserToken } from './get-user-token';

const url = process.env.REACT_APP_API_URL;
export class WorkflowService {
  async getWorkflows(organizationId: string): Promise<Workflow[]> {
    const res = await fetch(
      url + `/workflow?organizationId=${organizationId}`,
      {
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

  async getWorkflow(id: string, organizationId: string): Promise<Workflow> {
    const res = await fetch(
      url + `/workflow/${id}?organizationId=${organizationId}`,
      {
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
  async createWorkflow(
    name: string,
    organizationId: string,
  ): Promise<Workflow> {
    const res = await fetch(
      url + `/workflow?organizationId=${organizationId}`,
      {
        method: 'POST',
        body: JSON.stringify({ name }),
        headers: {
          Authorization: `Bearer ${await getUserToken()}`,
          'content-type': 'application/json',
        },
      },
    );
    if (res.status !== 201) {
      throw new Error('not found');
    }
    const data = await res.json();
    return data;
  }

  async addActionToWorkflow(
    id: string,
    actionId: string,
    organizationId: string,
  ): Promise<Workflow> {
    const res = await fetch(
      url + `/workflow/${id}/actions?organizationId=${organizationId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${await getUserToken()}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ actionId }),
      },
    );
    if (res.status !== 201) {
      throw new Error('not found');
    }
    return await res.json();
  }

  async linkActionNodes(
    id: string,
    fromName: string,
    toName: string,
    organizationId: string,
  ): Promise<Workflow> {
    const res = await fetch(
      url + `/workflow/${id}/action-links?organizationId=${organizationId}`,
      {
        body: JSON.stringify({ fromName, toName }),
        method: 'POST',
        headers: {
          Authorization: `Bearer ${await getUserToken()}`,
          'content-type': 'application/json',
        },
      },
    );
    if (res.status !== 201) {
      throw new Error('not found');
    }
    return await res.json();
  }

  async removeActionFromWorkflow(
    id: string,
    actionName: string,
    organizationId: string,
  ): Promise<Workflow> {
    const res = await fetch(
      url +
        `/workflow/${id}/actions/${actionName}?organizationId=${organizationId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${await getUserToken()}`,
          'content-type': 'application/json',
        },
      },
    );
    if (res.status !== 200) {
      throw new Error('not found');
    }
    return await res.json();
  }

  async removeActionLinkFromWorkflow(
    id: string,
    fromName: string,
    toName: string,
    organizationId: string,
  ): Promise<Workflow> {
    const res = await fetch(
      url +
        `/workflow/${id}/action-links/${fromName}/${toName}?organizationId=${organizationId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${await getUserToken()}`,
          'content-type': 'application/json',
        },
      },
    );
    if (res.status !== 200) {
      throw new Error('not found');
    }
    return await res.json();
  }

  async updateWorkflowNodePositions(
    id: string,
    positions: UpdateNodePositions,
    organizationId: string,
  ): Promise<void> {
    const res = await fetch(
      url + `/workflow/${id}/positions?organizationId=${organizationId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${await getUserToken()}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify(positions),
      },
    );
    if (res.status !== 200) {
      throw new Error('not found');
    }
  }
  async updateActionProperties(
    actionInstanceName: string,
    propertyValues: PropertyValue[],
    workflowId: string,
    organizationId: string,
  ): Promise<void> {
    const res = await fetch(
      url +
        `/workflow/${workflowId}/actions/${actionInstanceName}?organizationId=${organizationId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${await getUserToken()}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify(propertyValues),
      },
    );
    if (res.status !== 200) {
      throw new Error('not found');
    }
  }
}
