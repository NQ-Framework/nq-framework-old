import { DataCredentials, reducePropertyValuesToObject } from "@nqframework/models";
import { DataFetcherFactory } from "./dataFetcherFactory"
import { MsSqlFetcher } from "./sql/ms-sql-fetcher"
jest.mock('./sql/ms-sql-fetcher');
const mockCredentials: DataCredentials = {
    name: 'mock credentials',
    isRemote: false,
    configuration: [
        { name: 'serverIp', value: "test" },
        { name: 'port', value: "test" },
        { name: 'username', value: "test" },
        { name: 'password', value: "test" },
        { name: 'database', value: "test" },
        { name: 'type', value: "mssql" },
        { name: 'trustServerCertificate', value: true },
    ],
    credentialsType: {
        description: 'mock desc',
        isEnabled: true,
        name: 'mock credentials type',
        properties: [],
        type: 'mssql'
    }
}
describe('DataFetcherFactory', () => {
    it('should be defined', () => {
        expect(new DataFetcherFactory()).toBeDefined();
    });
    it('should return sql fetcher if config type is sql', () => {
        const fetcher = new DataFetcherFactory().create("mssql", mockCredentials.configuration)
        expect(fetcher).toBeDefined();
        const mockFetcher = MsSqlFetcher as jest.Mock;
        expect(mockFetcher.mock.instances.length).toEqual(1);
        expect(mockFetcher).toHaveBeenCalledWith(reducePropertyValuesToObject(mockCredentials.configuration));
    });

    it('should throw for invalid configurations', () => {
        expect(() => {
            new DataFetcherFactory().create("invalid", [])
        }).toThrowErrorMatchingSnapshot();
    });
});
