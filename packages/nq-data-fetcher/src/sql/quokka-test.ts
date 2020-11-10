import { MsSqlFetcher } from "./ms-sql-fetcher";
import { TYPES } from "tedious";
const fetcher = new MsSqlFetcher({
    serverIp: 'localhost',
    username: 'sa',
    password: 'Test.1234!!',
    trustServerCertificate: true,
    database: 'TestDB-SM',
    type: 'mssql'
});

fetcher.get({
    isProcedure: true,
    query: 'testProc',
    params: [{
        name: "TestParam",
        type: TYPES.Int,
        value: 3
    }],
    outParams: [
        {
            name: "TestOut",
            type: TYPES.Int
        }
    ]
}).then(data => {

    console.log(data);
}).catch(err => {
    console.error('erro je', err);
})