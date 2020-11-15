import { ActionInstance } from "./actions/action-instance";
import { ActionLink } from "./actions/action-link";

export interface Workflow {
    name: string;
    id: string;
    organizationId: string;
    isActive: boolean;
    actionInstances?: ActionInstance[];
    actionLinks?: ActionLink[];
}