import { MsSqlConfiguration } from "@nq-framework/models";
import { DataFetcherInterface } from "../dataFetcherInterface";
import { TediousType } from "tedious"
import { connect, execute } from "./ms-sql-util"

export class MsSqlFetcher implements DataFetcherInterface {
    constructor(private config: MsSqlConfiguration) { }
    async get(props: MsSqlFetcherProps): Promise<MsSqlDataResult> {
        const connection = await connect(this.config);
        return await execute(props, connection);
    }
}

export interface MsSqlFetcherProps {
    query: string
    isProcedure: boolean
    params?: MsSqlParameterType[]
    outParams?: MsSqlOutParameter[]
}
export type MsSqlParameterType = {
    name: string,
    value: any,
    type: TediousType
}
export type MsSqlOutParameter = {
    name: string,
    type: TediousType
}

export type MsSqlDataResult = {
    rowCount: number,
    rows: any[],
    outParams: any
}
