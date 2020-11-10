import { MsSqlConfiguration } from "@nq-framework/models";
import { MsSqlFetcher } from "./ms-sql-fetcher"
const mockConnectionConfiguration: MsSqlConfiguration = {
    type: 'mssql',
    username: 'username',
    password: 'password',
    serverIp: 'localhost',
    database: 'database',
    trustServerCertificate: true
}
describe('MsSqlFetcher', () => {
    it('should be defined', () => {
        expect(new MsSqlFetcher(mockConnectionConfiguration)).toBeDefined();
    });
    // it('should return data', async () => {
    //     const response = await new MsSqlFetcher(mockConnectionConfiguration).get({ version: 'v1', values: [] as any });
    //     expect(response).toBeDefined();
    // });
});
