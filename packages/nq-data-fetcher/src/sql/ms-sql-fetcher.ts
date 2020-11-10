import { MsSqlConfiguration } from "@nq-framework/models";
import { DataFetcherInterface } from "../dataFetcherInterface";
import { Request, Connection, TediousType } from "tedious"

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
}
export type MsSqlParameterType = {
    name: string,
    value: any,
    type: TediousType
}

export type MsSqlDataResult = {
    rowCount: number,
    rows: any[]
}

async function execute(props: MsSqlFetcherProps, connection: Connection): Promise<MsSqlDataResult> {
    return new Promise((resolve, reject) => {

        const request = new Request(props.query, (err, rowCount, rows) => {
            console.log('omg ', err, rowCount, rows);
            if (err) {
                reject(err);
                return;
            }
            resolve({ rowCount, rows })
        });
        if (props.params) {
            props.params.forEach(p => { request.addParameter(p.name, p.type, p.value) });
        }
        if (props.isProcedure) {
            connection.callProcedure(request);
        }
        else {
            connection.execSql(request);
        }
    });


}

async function connect(config: MsSqlConfiguration): Promise<Connection> {
    return new Promise((resolve, reject) => {
        var connection = new Connection({
            server: config.serverIp,
            authentication: {
                options: {
                    userName: config.username,
                    password: config.password,
                },
                type: 'default'
            },
            options: {
                trustServerCertificate: config.trustServerCertificate,
                database: config.database,
                rowCollectionOnRequestCompletion: true
            }
        });
        connection.connect((err) => {
            if (!err) {
                resolve(connection);
                return;
            }
            reject(err);
        });
    });
}