import { Action } from "./action";
import { ActionInstanceConfiguration } from "./action-instance-configuration";

export interface ActionInstance {
    name: string;
    action: Action;
    configuration: ActionInstanceConfiguration;
    isEnabled: boolean;
}