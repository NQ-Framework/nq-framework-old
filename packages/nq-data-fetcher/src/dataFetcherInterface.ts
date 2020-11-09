
export interface DataFetcher {
    get(props: any): Promise<{ data: any }>
}
