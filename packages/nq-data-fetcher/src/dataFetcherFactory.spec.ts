import { MsSqlConfiguration } from "@nq-framework/models";
import { DataFetcherFactory } from "./dataFetcherFactory"
import { SqlFetcher } from "./sql/sql-fetcher"
jest.mock('./sql/sql-fetcher');
const mockConnectionConfiguration: MsSqlConfiguration = {
    type: 'mssql',
    username: 'username',
    password: 'password',
    serverIp: 'localhost',
    database: 'database',
    trustServerCertificate: true
}
describe('DataFetcherFactory', () => {
    it('should be defined', () => {
        expect(new DataFetcherFactory()).toBeDefined();
    });
    it('should return sql fetcher if config type is sql', () => {
        const fetcher = new DataFetcherFactory().create({
            configuration: mockConnectionConfiguration,
        } as any)
        expect(fetcher).toBeDefined();
        const mockFetcher = SqlFetcher as jest.Mock;
        expect(mockFetcher.mock.instances.length).toEqual(1);
        expect(mockFetcher).toHaveBeenCalledWith(mockConnectionConfiguration);
    });

    it('should throw for invalid configurations', () => {
        expect(() => {
            new DataFetcherFactory().create({
                configuration: {
                    type: 'non-sql',
                },
            } as any)
        }).toThrowErrorMatchingSnapshot();
    });
});
