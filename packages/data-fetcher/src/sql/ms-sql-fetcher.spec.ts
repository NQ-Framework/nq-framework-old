import { MsSqlConfiguration } from "@nqframework/models";
import { MsSqlFetcher } from "./ms-sql-fetcher"
import { connect, execute } from './ms-sql-util';
jest.mock('./ms-sql-util');
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
    it('should return data', async () => {
        const connectSpy = connect as jest.Mock;
        connectSpy.mockImplementation(() => ({ connection: true }))
        const executeSpy = execute as jest.Mock;
        executeSpy.mockImplementation(() => ({ data: 'some data' }));
        const props = {
            isProcedure: false,
            query: 'select *',
        }
        const response = await new MsSqlFetcher(mockConnectionConfiguration).get(props);
        expect(connectSpy).toHaveBeenCalledWith(mockConnectionConfiguration);
        expect(executeSpy).toHaveBeenCalledWith(props, { connection: true });
        expect(response).toEqual({ data: 'some data' });
    });
});
