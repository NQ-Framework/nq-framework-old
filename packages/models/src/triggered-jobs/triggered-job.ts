import { ConfigurationInterface } from "../jobs/configuration-interface";

export type TriggeredJob = {
  id: string;
  name: string;
  active: boolean;
  endpointName: string;
  organizationId: string;
  configuration: ConfigurationInterface;
  allowedServiceAccountIds: string[];
};
