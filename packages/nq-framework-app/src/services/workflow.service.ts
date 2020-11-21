import { Workflow } from "@nqframework/models";
import { UpdateNodePositions } from "../types/UpdateNodePositions";

const url = process.env.REACT_APP_API_URL;
const token = process.env.REACT_APP_TOKEN;
export class WorkflowService {
  async getWorkflow(): Promise<Workflow> {
    const res = await fetch(
      url + "/workflow/s9JKbcLMio6CVC5K7nHG?organizationId=livona",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.status !== 200) {
      throw new Error("not found");
    }
    const data = await res.json();
    return data;
  }

  async addActionToWorkflow(actionId: string): Promise<Workflow> {
    const res = await fetch(
      url + "/workflow/s9JKbcLMio6CVC5K7nHG/actions?organizationId=livona",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
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

  async linkActionNodes(fromName: string, toName: string): Promise<Workflow> {
    const res = await fetch(
      url + `/workflow/s9JKbcLMio6CVC5K7nHG/action-links?organizationId=livona`,
      {
        body: JSON.stringify({ fromName, toName }),
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
      }
    );
    if (res.status !== 201) {
      throw new Error("not found");
    }
    return await res.json();
  }

  async removeActionFromWorkflow(actionName: string): Promise<Workflow> {
    const res = await fetch(
      url +
        `/workflow/s9JKbcLMio6CVC5K7nHG/actions/${actionName}?organizationId=livona`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
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
    positions: UpdateNodePositions
  ): Promise<void> {
    const res = await fetch(
      url + "/workflow/s9JKbcLMio6CVC5K7nHG/positions?organizationId=livona",
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
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
