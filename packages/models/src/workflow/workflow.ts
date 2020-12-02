import { ActionInstance } from "./actions/action-instance";
import { ActionLink } from "./actions/action-link";
import { WorkflowTriggerApi } from "./triggers/workflow-trigger-api";

export interface Workflow {
  name: string;
  id: string;
  organizationId: string;
  isActive: boolean;
  actionInstances: ActionInstance[];
  actionLinks: ActionLink[];
  triggers: WorkflowTriggerApi[];
  endpoints?: string[];
}
