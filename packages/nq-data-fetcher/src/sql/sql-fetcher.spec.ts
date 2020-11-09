import { MsSqlConfiguration } from "@nq-framework/models";
import { SqlFetcher } from "./sql-fetcher"
const mockConnectionConfiguration: MsSqlConfiguration = {
    type: 'mssql',
    username: 'username',
    password: 'password',
    serverIp: 'localhost',
    database: 'database',
    trustServerCertificate: true
}
describe('SqlFetcher', () => {
    it('should be defined', () => {
        expect(new SqlFetcher(mockConnectionConfiguration)).toBeDefined();
    });
    it('should return data', async () => {
        const response = await new SqlFetcher(mockConnectionConfiguration).get({ version: 'v1', values: [] as any });
        expect(response).toBeDefined();
    });
});
