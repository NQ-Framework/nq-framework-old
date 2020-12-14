import { getMockExecutionContext } from '../mocks/get-mock-execution-context';
import { mockExecutionResult } from '../mocks/mock-execution-result';
import { evaluateTriggerOutput } from './evaluate-trigger-output';
import { evaluateProperties } from '../../core/utils';
import { reducePropertyValuesToObject } from '@nqframework/models';

jest.mock('@nqframework/models', () => ({
  ...(jest.requireActual('@nqframework/models') as any),
  reducePropertyValuesToObject: jest.fn(),
}));
jest.mock('../../core/utils', () => ({
  ...(jest.requireActual('../../core/utils') as any),
  evaluateProperties: jest.fn(),
}));

describe('Evalute Trigger Output', () => {
  it('should return empty array if no output properties defined on trigger', async () => {
    let result = await evaluateTriggerOutput(
      {} as any,
      mockExecutionResult,
      getMockExecutionContext(),
    );
    expect(result).toEqual([]);

    result = await evaluateTriggerOutput(
      { output: [] } as any,
      mockExecutionResult,
      getMockExecutionContext(),
    );
    expect(result).toEqual([]);
  });

  it('should evaluate any output properties defined', async () => {
    const mock = evaluateProperties as jest.Mock;
    mock.mockImplementation((input) => input);
    const result = await evaluateTriggerOutput(
      {
        output: [
          { name: 'mock prop', value: 'mock prop value' },
          { name: 'second mock prop', value: 'mock prop value' },
        ],
      } as any,
      mockExecutionResult,
      getMockExecutionContext(),
    );
    expect(result).toEqual([
      { name: 'mock prop', value: 'mock prop value' },
      { name: 'second mock prop', value: 'mock prop value' },
    ]);
    expect(mock).toHaveBeenCalledWith(
      [
        { name: 'mock prop', value: 'mock prop value' },
        { name: 'second mock prop', value: 'mock prop value' },
      ],
      expect.any(Object),
    );
  });
});
