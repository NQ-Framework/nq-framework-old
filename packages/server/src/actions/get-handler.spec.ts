import { Action } from '@nqframework/models';
import { getHandler } from "./get-handler";
import { ActionService } from "./action.service";
jest.mock('./action.service');

const mockAction: Action = {
  id: "1",
  name: "mock action",
  inputFields: [],
  outputFields: [],
  path: "./action.service",
}


describe('getHandler', () => {

  it('should get handler based on action', () => {
    var handler = getHandler(mockAction);
    expect(handler).toBeDefined();
  });
});
