import { FetcherProps } from "@nqframework/models";
import { DataFetcher } from "../dataFetcherInterface";

export class SqlFetcher implements DataFetcher {
    constructor(private connectionString: string) { }
    async get(props: FetcherProps): Promise<{ data: any; }> {
        console.log('props ', props);
        return { data: "this is sample data obtained using: " + this.connectionString };
    }

}