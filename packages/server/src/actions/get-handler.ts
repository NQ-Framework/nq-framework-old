import { Action, ActionHandler } from '@nqframework/models';

export const getHandler = (action: Action): ActionHandler => {
  const handler = require(action.path).handler as ActionHandler;
  return handler;
};
