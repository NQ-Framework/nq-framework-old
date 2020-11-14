import { MsSqlConfiguration } from "@nqframework/models";
import { connect, execute } from './ms-sql-util';
import { Connection, Request, TYPES } from 'tedious';

jest.mock('tedious');
const mockConnection: jest.Mock = Connection as any;
const mockRequest: jest.Mock = Request as any;

const mockConnectionConfiguration: MsSqlConfiguration = {
    type: 'mssql',
    username: 'username',
    password: 'password',
    serverIp: 'localhost',
    port: '321',
    database: 'database',
    trustServerCertificate: true
}
describe('MsSqlUtils', () => {
    beforeAll(() => {
        mockConnection.mockClear();
        mockRequest.mockClear();
    });
    it('should connect to db with provided config', async () => {
        mockConnection.mockImplementation(() => ({
            connect: (fn: Function) => {
                fn();
            },
        }));
        const connection = await connect(mockConnectionConfiguration);
        expect(mockConnection).toHaveBeenCalledWith(
            {
                server: mockConnectionConfiguration.serverIp,
                authentication: {
                    options: {
                        userName: mockConnectionConfiguration.username,
                        password: mockConnectionConfiguration.password
                    },
                    type: 'default'

                },
                options: {
                    trustServerCertificate: mockConnectionConfiguration.trustServerCertificate,
                    database: mockConnectionConfiguration.database,
                    port: Number.parseInt(mockConnectionConfiguration.port)
                }
            }
        )
        expect(connection).toEqual({
            connect: expect.any(Function),
        })
    });

    it('should parse port from server ip if provided with comma', async () => {
        mockConnection.mockImplementation(() => ({
            connect: (fn: Function) => {
                fn();
            },
        }));
        const connection = await connect({ ...mockConnectionConfiguration, serverIp: 'localhost,1234', port: '' });
        expect(mockConnection).toHaveBeenCalledWith(
            {
                server: 'localhost',
                authentication: {
                    options: {
                        userName: mockConnectionConfiguration.username,
                        password: mockConnectionConfiguration.password
                    },
                    type: 'default'

                },
                options: {
                    trustServerCertificate: mockConnectionConfiguration.trustServerCertificate,
                    database: mockConnectionConfiguration.database,
                    port: 1234
                }
            }
        )
        expect(connection).toEqual({
            connect: expect.any(Function),
        })
    });

    it('port field in config overrides port in ip address', async () => {
        mockConnection.mockImplementation(() => ({
            connect: (fn: Function) => {
                fn();
            },
        }));
        const connection = await connect({ ...mockConnectionConfiguration, serverIp: 'localhost,1234' });
        expect(mockConnection).toHaveBeenCalledWith(
            {
                server: 'localhost',
                authentication: {
                    options: {
                        userName: mockConnectionConfiguration.username,
                        password: mockConnectionConfiguration.password
                    },
                    type: 'default'

                },
                options: {
                    trustServerCertificate: mockConnectionConfiguration.trustServerCertificate,
                    database: mockConnectionConfiguration.database,
                    port: Number.parseInt(mockConnectionConfiguration.port)
                }
            }
        )
        expect(connection).toEqual({
            connect: expect.any(Function),
        })
    });
    it('should throw error received from db', async () => {
        mockConnection.mockImplementation(() => ({
            connect: (fn: Function) => {
                fn(new Error('Invalid credentials'));
            }
        }));
        await expect(connect(mockConnectionConfiguration)).rejects.toThrowErrorMatchingSnapshot();
    });

    it('should execute sql based on props', async () => {
        mockRequest.mockClear();
        mockConnection.mockClear();
        const mockParam = { name: 'test param name', type: TYPES.Int, value: 1 }
        const mockProps = { query: "test query", isProcedure: false, params: [mockParam] };
        const conInstance = { close: jest.fn().mockImplementation(() => { }), execSql: jest.fn(), callProcedure: jest.fn() }
        let rowCallback: Function;
        const addParamMock = jest.fn();
        mockRequest.mockImplementation(() => {
            return {
                on: jest.fn().mockImplementation((event, cb) => {
                    if (event === "row") {
                        rowCallback = cb;
                    }
                }),
                addParameter: addParamMock
            }
        })
        conInstance.execSql.mockImplementation(() => {
            rowCallback([{
                metadata: { colName: 'test column name' },
                value: 'test value'
            }]);
            mockRequest.mock.calls[0][1]();
        });
        const response = await execute(mockProps, conInstance as any);
        expect(conInstance.execSql).toHaveBeenCalledTimes(1);
        expect(conInstance.callProcedure).toHaveBeenCalledTimes(0);
        expect(conInstance.close).toHaveBeenCalledTimes(1);
        expect(mockRequest).toHaveBeenCalledWith(mockProps.query, expect.any(Function));
        expect(response).toEqual({ rowCount: 1, rows: [{ "test column name": "test value" }], outParams: {} });
        expect(addParamMock).toHaveBeenCalledWith(mockParam.name, mockParam.type, mockParam.value);
    });
    it('should execute procedure based on props', async () => {
        mockRequest.mockClear();
        mockConnection.mockClear();

        const mockParam = { name: 'test param name', type: TYPES.Int, value: 1 };
        const mockOutputParam = { name: 'test output param name', type: TYPES.Int };
        const mockProps = { query: "test procedure", isProcedure: true, params: [mockParam], outParams: [mockOutputParam] };
        const conInstance = { close: jest.fn().mockImplementation(() => { }), execSql: jest.fn(), callProcedure: jest.fn() }
        let rowCallback: Function;
        let returnValueCallback: Function;
        const addParamMock = jest.fn();
        const addOutputParamMock = jest.fn();
        mockRequest.mockImplementation(() => {
            return {
                on: jest.fn().mockImplementation((event, cb) => {
                    if (event === "row") {
                        rowCallback = cb;
                    }
                    else if (event === "returnValue") {
                        returnValueCallback = cb;
                    }
                }),
                addParameter: addParamMock,
                addOutputParameter: addOutputParamMock
            }
        })
        conInstance.callProcedure.mockImplementation(() => {
            rowCallback([{
                metadata: { colName: 'test column name' },
                value: 'test value'
            }]);
            returnValueCallback(mockOutputParam.name, 1);
            mockRequest.mock.calls[0][1]();
        });
        const response = await execute(mockProps, conInstance as any);
        expect(conInstance.callProcedure).toHaveBeenCalledTimes(1);
        expect(conInstance.execSql).toHaveBeenCalledTimes(0);
        expect(conInstance.close).toHaveBeenCalledTimes(1);
        expect(mockRequest).toHaveBeenCalledWith(mockProps.query, expect.any(Function));
        expect(response).toEqual({ rowCount: 1, rows: [{ "test column name": "test value" }], outParams: { "test output param name": 1 } });
        expect(addParamMock).toHaveBeenCalledWith(mockParam.name, mockParam.type, mockParam.value);
        expect(addOutputParamMock).toHaveBeenCalledWith(mockOutputParam.name, mockOutputParam.type);
    });
    it('should reject if sql returns error', async () => {
        mockRequest.mockClear();
        mockConnection.mockClear();

        const mockProps = { query: "test procedure", isProcedure: true };
        const conInstance = { close: jest.fn().mockImplementation(() => { }), execSql: jest.fn(), callProcedure: jest.fn() }
        conInstance.callProcedure.mockImplementation(() => {
            mockRequest.mock.calls[0][1](new Error('invalid sql'));
        });
        await expect(execute(mockProps, conInstance as any)).rejects.toThrowErrorMatchingSnapshot();
        expect(conInstance.callProcedure).toHaveBeenCalledTimes(1);
        expect(conInstance.close).toHaveBeenCalledTimes(1);
    });
});
