import { MsSqlConfiguration } from "@nq-framework/models";
import { DataFetcherInterface } from "../dataFetcherInterface";

export class SqlFetcher implements DataFetcherInterface {
    constructor(private config: MsSqlConfiguration) { }
    async get(props: any): Promise<{ data: any; }> {
        console.log('props ', props);
        return { data: "this is sample data obtained using: " + JSON.stringify(this.config) };
    }

}