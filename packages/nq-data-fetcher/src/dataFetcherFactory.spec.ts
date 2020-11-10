import { MsSqlConfiguration } from "@nq-framework/models";
import { DataFetcherFactory } from "./dataFetcherFactory"
import { MsSqlFetcher } from "./sql/ms-sql-fetcher"
jest.mock('./sql/ms-sql-fetcher');
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
        const mockFetcher = MsSqlFetcher as jest.Mock;
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
