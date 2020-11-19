import { mockWorkflow } from '../mocks/mock-workflow';
import { createExecutionContext } from './create-execution-context';

const FIXED_SYSTEM_TIME = '2020-11-10T00:00:00.000Z';

describe('createExecutionContext', () => {
  beforeEach(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(Date.parse(FIXED_SYSTEM_TIME));
  });
  it('creates the context', async () => {
    const result = await createExecutionContext([], mockWorkflow);
    expect(result).toBeDefined();
    expect(result.startTime.toISOString()).toEqual(FIXED_SYSTEM_TIME);
  });

  it('sets links to empty array if undefined', async () => {
    const result = await createExecutionContext([], {
      ...mockWorkflow,
      actionLinks: undefined as any,
    });
    expect(result.workflow.actionLinks).toBeDefined();
    expect(result.workflow.actionLinks.length).toBe(0);
  });

  it('throw if workflow has no actions', async () => {
    await expect(
      createExecutionContext([], {
        ...mockWorkflow,
        actionInstances: undefined as any,
      }),
    ).rejects.toThrowErrorMatchingSnapshot();
    expect('test').toMatchSnapshot();
  });

  it('evaluate static properties', async () => {
    const result = await createExecutionContext(
      [{ name: 'test prop', value: 'test value' }],
      { ...mockWorkflow },
    );
    expect(result.input['test prop']).toEqual('test value');
  });
  // it("evaluate static properties", async () => {
  //     const result = await createExecutionContext([{ name: "test prop", value: "test value" }], { ...mockWorkflow });
  //     expect(result.input["test prop"]).toEqual("test value")
  // })
});
