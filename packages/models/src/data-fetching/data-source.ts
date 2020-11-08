import { ApiConfiguration } from "./api-configuration";
import { SqlConfiguration } from "./sql-configuration";

//         { type: 'sql', handles: ['main-db'], cloudAccessible: true, connectionString: 'sample-conn-string' }
export type DataSource = {
    handles: string[];
    cloudAccessible: boolean;
    configuration: SqlConfiguration | ApiConfiguration;
}
