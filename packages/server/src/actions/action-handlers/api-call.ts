import {
  ActionHandler,
  ActionInstance,
  PropertyValue,
  reducePropertyValuesToObject,
  WorkflowExecutionContext,
} from '@nqframework/models';
import { evaluateExpression } from 'src/core/utils';
import fetch, { RequestInit } from 'node-fetch';

export const handler: ActionHandler = {
  handle: async (
    propertyValues: PropertyValue[],
    actionInstance: ActionInstance,
    workflowExecution: WorkflowExecutionContext,
  ): Promise<PropertyValue[]> => {
    const credentialsName = propertyValues.find((i) => i.name === 'credentials')
      ?.value;
    if (!credentialsName) {
      throw new Error('Missing required parameter message');
    }
    const credentials = workflowExecution.organization.dataCredentials.find(
      (dc) => dc.name === credentialsName,
    );
    if (!credentials) {
      throw new Error(
        `Could not find credentials: ${credentialsName} in organization: ${workflowExecution.organization.name}`,
      );
    }

    const credentialConfig = reducePropertyValuesToObject(
      credentials.configuration,
    );
    const apiCallConfig = reducePropertyValuesToObject(propertyValues);

    const token = await evaluateExpression(
      credentialConfig.getTokenExpression,
      {
        actionInstance,
        propertyValues,
        workflowExecution,
        fetch,
        credentialConfig,
      },
    );
    const requestInit: RequestInit = {
      method: apiCallConfig.method,
      headers: {},
    };

    if (apiCallConfig.sendBody) {
      requestInit.body = apiCallConfig.body;
      const headers = requestInit.headers as any;
      headers['Content-Type'] = apiCallConfig.contentType;
    }

    if (token) {
      const headers = requestInit.headers as any;
      headers['Authorization'] = 'Bearer ' + token.access_token;
    }

    const fetchResponse = await fetch(apiCallConfig.url, requestInit);
    const jsonResponse = await fetchResponse.json();
    return [
      {
        name: 'response',
        value: jsonResponse,
      },
    ];
  },
};
