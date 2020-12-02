import {
  ActionHandler,
  PropertyValue,
} from '@nqframework/models';

export const handler: ActionHandler = {
  handle: async (
    propertyValues: PropertyValue[],
  ): Promise<PropertyValue[]> => {
    const message = propertyValues.find((i) => i.name === 'message')?.value;
    if (!message) {
      throw new Error('Missing required parameter message');
    }
    console.log('Log action instance says :' + message);

    return [
      {
        name: 'message',
        value: message,
      },
    ];
  },
};
