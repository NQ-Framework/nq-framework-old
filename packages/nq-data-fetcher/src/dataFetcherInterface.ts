import { FetcherProps } from '@nqframework/models';

export interface DataFetcher {
    get(props: FetcherProps): Promise<{ data: any }>
}
