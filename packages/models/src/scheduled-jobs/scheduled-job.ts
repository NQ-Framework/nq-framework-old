import { ConfigurationInterface } from "../jobs/configuration-interface";

export type ScheduledJob = {
  id: string;
  name: string;
  active: boolean;
  cronInterval: string;
  organizationId: string;
  configuration: ConfigurationInterface;
};
