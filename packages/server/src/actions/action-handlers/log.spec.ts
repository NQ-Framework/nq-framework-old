import { handler } from './log';

describe('log action', () => {
  it('should log message value and pass it back out', async () => {
    const result = await handler.handle(
      [{ name: 'message', value: 'test' }],
      {} as any,
      {} as any,
      {} as any,
    );
    expect(result).toEqual([{ name: 'message', value: 'test' }]);
  });
  it('should throw when message is not present', async () => {
    await expect(
      handler.handle(
        [{ name: 'not message', value: 'test' }],
        {} as any,
        {} as any,
        {} as any,
      ),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
});
