import { DataSource } from "@nqframework/models";
import { DataFetcher } from "./dataFetcherInterface";
import { SqlFetcher } from "./sql/sql-fetcher";

export class DataFetcherFactory {
    create(dataSource: DataSource): DataFetcher {
        if (dataSource.configuration.type === "sql") {
            return new SqlFetcher(dataSource.configuration.connectionString);
        }
        throw new Error("Could not create Fetcher for request " + JSON.stringify(dataSource));
    }
}