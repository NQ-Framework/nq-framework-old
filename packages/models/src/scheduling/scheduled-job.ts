import { ConfigurationInterface } from "./configuration-interface";

export type ScheduledJob = {
    name: string,
    active: boolean,
    cronInterval: string,
    organizationId: string,
    configuration: ConfigurationInterface
}