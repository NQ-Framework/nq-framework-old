import { ActionInstance } from "./actions/action-instance";
import { ActionLink } from "./actions/action-link";
import { WorkflowTriggerBase } from "./triggers/workflow-trigger-base";

export interface Workflow {
    name: string;
    id: string;
    organizationId: string;
    isActive: boolean;
    actionInstances?: ActionInstance[];
    actionLinks?: ActionLink[];
    triggers: WorkflowTriggerBase[];
}