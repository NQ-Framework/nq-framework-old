import { Workflow } from "@nqframework/models";
import { UpdateNodePositions } from "../types/UpdateNodePositions";
import { getUserToken } from "./get-user-token";

const url = process.env.REACT_APP_API_URL;
const token = process.env.REACT_APP_TOKEN;
export class WorkflowService {
  async getWorkflows(): Promise<Workflow[]> {
    const res = await fetch(
      url + `/workflow?organizationId=livona`,
      {
        headers: {
          Authorization: `Bearer ${await getUserToken()}`,
        },
      }
    );
    if (res.status !== 200) {
      throw new Error("not found");
    }
    const data = await res.json();
    return data;
  }

  async getWorkflow(id: string): Promise<Workflow> {
    const res = await fetch(
      url + `/workflow/${id}?organizationId=livona`,
      {
        headers: {
          Authorization: `Bearer ${await getUserToken()}`,
        },
      }
    );
    if (res.status !== 200) {
      throw new Error("not found");
    }
    const data = await res.json();
    return data;
  }
  async createWorkflow(name: string): Promise<Workflow> {
    const res = await fetch(
      url + `/workflow?organizationId=livona`,
      {
        method: "POST",
        body: JSON.stringify({ name }),
        headers: {
          Authorization: `Bearer ${await getUserToken()}`,
          "content-type": "application/json"
        },
      }
    );
    if (res.status !== 201) {
      throw new Error("not found");
    }
    const data = await res.json();
    return data;
  }

  async addActionToWorkflow(id: string, actionId: string): Promise<Workflow> {
    const res = await fetch(
      url + `/workflow/${id}/actions?organizationId=livona`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${await getUserToken()}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ actionId }),
      }
    );
    if (res.status !== 201) {
      throw new Error("not found");
    }
    return await res.json();
  }

  async linkActionNodes(id: string, fromName: string, toName: string): Promise<Workflow> {
    const res = await fetch(
      url + `/workflow/${id}/action-links?organizationId=livona`,
      {
        body: JSON.stringify({ fromName, toName }),
        method: "POST",
        headers: {
          Authorization: `Bearer ${await getUserToken()}`,
          "content-type": "application/json",
        },
      }
    );
    if (res.status !== 201) {
      throw new Error("not found");
    }
    return await res.json();
  }

  async removeActionFromWorkflow(id: string, actionName: string): Promise<Workflow> {
    const res = await fetch(
      url +
      `/workflow/${id}/actions/${actionName}?organizationId=livona`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${await getUserToken()}`,
          "content-type": "application/json",
        },
      }
    );
    if (res.status !== 200) {
      throw new Error("not found");
    }
    return await res.json();
  }

  async updateWorkflowNodePositions(
    id: string,
    positions: UpdateNodePositions
  ): Promise<void> {
    const res = await fetch(
      url + `/workflow/${id}/positions?organizationId=livona`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${await getUserToken()}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(positions),
      }
    );
    if (res.status !== 200) {
      throw new Error("not found");
    }
  }
}
