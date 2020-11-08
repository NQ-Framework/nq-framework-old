import { ApiConfiguration } from "./api-configuration";
import { SqlConfiguration } from "./sql-configuration";

export type DataSource = {
  handles: string[];
  directAccess: boolean;
  configuration: SqlConfiguration | ApiConfiguration;
};
