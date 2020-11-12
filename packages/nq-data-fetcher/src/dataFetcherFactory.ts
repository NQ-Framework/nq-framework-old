import { DataSource } from "@nqframework/models";
import { MsSqlConfiguration } from "@nqframework/models";
import { DataFetcherInterface } from "./dataFetcherInterface";
import { MsSqlFetcher } from "./sql/ms-sql-fetcher";

export class DataFetcherFactory {
    create(dataSource: DataSource): DataFetcherInterface {
        if (dataSource.configuration.type === "mssql") {
            return new MsSqlFetcher(dataSource.configuration as MsSqlConfiguration);
        }
        throw new Error("Could not create Fetcher for request " + JSON.stringify(dataSource));
    }
}