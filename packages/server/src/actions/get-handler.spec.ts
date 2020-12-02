import { Action } from '@nqframework/models';
import { getHandler } from './get-handler';
jest.mock('./action.service');

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

describe('getHandler', () => {
  it('should get handler based on action', () => {
    const handler = getHandler(mockAction);
    expect(handler).toBeDefined();
  });
});
