import { Action } from '@nqframework/models';
import { handler } from './mssql';

const mockAction: Action = {
  version: 1,
  hasDefaultPort: true,
  isEnabled: true,
  id: '1',
  name: 'mock action',
  properties: [],
  outputFields: [],
  path: './action-handlers/mssql',
};

describe('mssql action', () => {
  it('should execute query and return result', async () => {
    const result = await handler.handle(
      [
        { name: 'query', value: 'mock query' },
        { name: 'dataSource', value: 'mock data source' },
        { name: 'userId', value: 'mock user id' },
      ],
      {} as any,
      { workflow: { organizationId: 'mock org id' } } as any,
      {
        get: jest.fn().mockImplementation(() => ({
          getDataFetcher: () => ({
            get: () => ({
              rows: [{ testCol: 'test val' }],
            }),
          }),
        })),
      },
    );
    expect(result).toEqual([
      { name: 'queryResult', value: { rows: [{ testCol: 'test val' }] } },
    ]);
  });
  it('should throw when required params are not present', async () => {
    await expect(
      handler.handle(
        [{ name: 'non query', value: 'test' }],
        {} as any,
        {} as any,
        { get: jest.fn() } as any,
      ),
    ).rejects.toThrowErrorMatchingSnapshot();
    await expect(
      handler.handle(
        [{ name: 'query', value: 'test' }],
        {} as any,
        {} as any,
        { get: jest.fn() } as any,
      ),
    ).rejects.toThrowErrorMatchingSnapshot();
    await expect(
      handler.handle(
        [
          { name: 'query', value: 'test' },
          { name: 'dataSource', value: 'test' },
        ],
        {} as any,
        {} as any,
        { get: jest.fn() } as any,
      ),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
});
