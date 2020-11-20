import { handler } from './js-function';
import { evaluateExpression } from '../../core/utils/evaluateExpression';
jest.mock('../../core/utils/evaluateExpression');

describe('js function action', () => {
  it('should call vm to evaluate  code and pass the value back out', async () => {
    const mock = evaluateExpression as jest.Mock;
    mock.mockImplementation(() => {
      return 'test';
    });
    const result = await handler.handle(
      [{ name: 'code', value: 'test' }],
      {} as any,
      {} as any,
      {} as any,
    );
    expect(result).toEqual([{ name: 'output', value: 'test' }]);
    expect(mock).toHaveBeenCalledWith('test', {
      actionInstance: {},
      propertyValues: [{ name: 'code', value: 'test' }],
      workflowExecution: {},
    });
  });
  it('should throw when message is not present', async () => {
    await expect(
      handler.handle(
        [{ name: 'not code', value: 'test' }],
        {} as any,
        {} as any,
        {} as any,
      ),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
});
