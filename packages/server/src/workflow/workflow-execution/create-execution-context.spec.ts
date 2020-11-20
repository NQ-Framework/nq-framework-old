import { mockWorkflow } from '../mocks/mock-workflow';
import { createExecutionContext } from './create-execution-context';
import { evaluateProperties, reducePropertyValuesToObject } from "../../core/utils"
import { initializeContext } from "./initialize-context"


jest.mock("../../core/utils", () => ({ ...jest.requireActual("../../core/utils") as any, evaluateProperties: jest.fn(), reducePropertyValuesToObject: jest.fn() }))
jest.mock("./initialize-context");

const FIXED_SYSTEM_TIME = '2020-11-10T00:00:00.000Z';

describe('createExecutionContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers('modern');
    jest.setSystemTime(Date.parse(FIXED_SYSTEM_TIME));
    (initializeContext as jest.Mock).mockImplementation((context) => {
      return context;
    })
  });
  it('creates the context', async () => {
    const result = await createExecutionContext([], mockWorkflow);
    expect(result).toBeDefined();
    expect(result.startTime.toISOString()).toEqual(FIXED_SYSTEM_TIME);
  });


  it('evaluate static properties', async () => {
    (reducePropertyValuesToObject as jest.Mock).mockImplementation(() => {
      return {
        "test prop": "test value"
      }
    });
    const result = await createExecutionContext(
      [{ name: 'test prop', value: 'test value' }],
      { ...mockWorkflow },
    );
    expect(result.input['test prop']).toEqual('test value');
    expect(reducePropertyValuesToObject).toHaveBeenCalledTimes(1);
    expect(evaluateProperties).toHaveBeenCalledTimes(1);
  });
});
