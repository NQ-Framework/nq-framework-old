import { Action } from '@nqframework/models';
import { handler } from './log';

const mockAction: Action = {
  version: 1,
  hasDefaultPort: true,
  isEnabled: true,
  id: '1',
  name: 'mock action',
  properties: [],
  outputFields: [],
  path: './action-handlers/log',
};

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
