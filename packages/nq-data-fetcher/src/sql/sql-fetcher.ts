import { MsSqlConfiguration } from "@nq-framework/models";
import { DataFetcher } from "../dataFetcherInterface";

export class SqlFetcher implements DataFetcher {
    constructor(private config: MsSqlConfiguration) { }
    async get(props: any): Promise<{ data: any; }> {
        console.log('props ', props);
        return { data: "this is sample data obtained using: " + JSON.stringify(this.config) };
    }

}