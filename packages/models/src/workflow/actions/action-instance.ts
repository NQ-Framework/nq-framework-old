import { Action } from "./action";
import { ActionInstanceConfiguration } from "./action-instance-configuration";

export interface ActionInstance {
    id: string;
    action: Action;
    configuration: ActionInstanceConfiguration;
    isEnabled: boolean;
}