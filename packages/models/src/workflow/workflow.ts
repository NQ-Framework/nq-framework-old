import { ActionInstance } from "./actions/action-instance";
import { ActionLink } from "./actions/action-link";
import { WorkflowTriggerInstance } from "./triggers/workflow-trigger-instance";

export interface Workflow {
  name: string;
  id: string;
  organizationId: string;
  isActive: boolean;
  actionInstances: ActionInstance[];
  actionLinks: ActionLink[];
  triggers: WorkflowTriggerInstance[];
  endpoints?: string[];
}
