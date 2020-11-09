
export interface DataFetcherInterface {
    get(props: any): Promise<{ data: any }>
}
