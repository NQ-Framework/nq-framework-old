import { MsSqlConfiguration } from "@nq-framework/models";
import { Connection, Request } from "tedious";
import { MsSqlFetcherProps, MsSqlDataResult } from "./ms-sql-fetcher";

export async function execute(props: MsSqlFetcherProps, connection: Connection): Promise<MsSqlDataResult> {
    return new Promise((resolve, reject) => {

        const rows: any[] = [];
        const outParams: any = {};
        const request = new Request(props.query, (err) => {
            connection.close();

            if (err) {
                reject(err);
                return;
            }
            resolve({ rowCount: rows.length, rows, outParams })
        });
        request.on("row", (columns) => {
            rows.push(columns.filter(c => c.metadata.colName !== 'metadata').reduce((row, c) => {
                row[c.metadata.colName] = c.value;
                return row;
            }, {}));
        });
        request.on("returnValue", (name, value) => {
            outParams[name] = value;
        })
        if (props.params) {
            props.params.forEach(p => { request.addParameter(p.name, p.type, p.value) });
        }
        if (props.outParams) {
            props.outParams.forEach(p => { request.addOutputParameter(p.name, p.type) });
        }
        if (props.isProcedure) {
            connection.callProcedure(request);
        }
        else {
            connection.execSql(request);
        }
    });
}

export async function connect(config: MsSqlConfiguration): Promise<Connection> {
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