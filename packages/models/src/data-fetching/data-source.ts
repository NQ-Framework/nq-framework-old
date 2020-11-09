import { ApiConfiguration } from "./api-configuration";
import { MsSqlConfiguration } from "./ms-sql-configuration";

export type DataSource = {
  handles: string[];
  directAccess: boolean;
  configuration: MsSqlConfiguration | ApiConfiguration;
};
