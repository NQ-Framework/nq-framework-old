import { handler } from './mssql';

describe('mssql action', () => {
  it('should execute query and return result', async () => {
    const result = await handler.handle(
      [
        { name: 'query', value: 'mock query' },
        { name: 'credentials', value: 'credentials' },
        { name: 'userId', value: 'mock user id' },
        { name: 'isProcedure', value: false },
        { name: 'inputParameters', value: [{name:"item", value:[{name:'p1', value:'v1'}]}] },
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
  it('should execute query without parameters', async () => {
    const result = await handler.handle(
      [
        { name: 'query', value: 'mock query' },
        { name: 'credentials', value: 'credentials' },
        { name: 'userId', value: 'mock user id' },
        { name: 'isProcedure', value: false },
        { name: 'inputParameters', value: undefined },
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
          { name: 'credentials', value: 'test' },
        ],
        {} as any,
        {} as any,
        { get: jest.fn() } as any,
      ),
    ).rejects.toThrowErrorMatchingSnapshot();
    await expect(
      handler.handle(
        [
          { name: 'query', value: 'test' },
          { name: 'credentials', value: 'test' },
          { name: 'userId', value: 'test' },
        ],
        {} as any,
        {} as any,
        { get: jest.fn() } as any,
      ),
    ).rejects.toThrowErrorMatchingSnapshot();
    await expect(
      handler.handle(
        [
          { name: 'query', value: 'test' },
          { name: 'credentials', value: 'test' },
          { name: 'userId', value: 'test' },
          { name: 'inputParameters', value: 'test' },
        ],
        {} as any,
        {} as any,
        { get: jest.fn() } as any,
      ),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
});
