import { PropertyValue, reducePropertyValuesToObject } from "@nqframework/models";
import { DataFetcherInterface } from "./dataFetcherInterface";
import { MsSqlFetcher } from "./sql/ms-sql-fetcher";

export class DataFetcherFactory {
    create(type: string, configuration: PropertyValue[]): DataFetcherInterface {
        const configValues = reducePropertyValuesToObject(configuration);
        if (type === "mssql") {
            return new MsSqlFetcher({
                serverIp: configValues.serverIp,
                port: configValues.port,
                username: configValues.username,
                password: configValues.password,
                database: configValues.database,
                trustServerCertificate: configValues.trustServerCertificate,
                type: "mssql",
            });
        }
        throw new Error("Could not create Fetcher for request " + type + " : " + JSON.stringify(configuration));
    }
}