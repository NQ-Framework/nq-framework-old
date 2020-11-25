import {
  ActionHandler,
  ActionInstance,
  PropertyValue,
  WorkflowExecutionContext,
} from '@nqframework/models';
import { ModuleRef } from '@nestjs/core';
import { RequestRouterService } from '../../db-connection/request-router/request-router.service';
import { MsSqlFetcher } from '@nqframework/data-fetcher';

export const handler: ActionHandler = {
  handle: async (
    propertyValues: PropertyValue[],
    actionInstance: ActionInstance,
    workflowExecution: WorkflowExecutionContext,
    moduleRef: ModuleRef,
  ): Promise<PropertyValue[]> => {
    const query = propertyValues.find((i) => i.name === 'query')?.value;
    const credentials = propertyValues.find((i) => i.name === 'credentials')
      ?.value;
    const userId = propertyValues.find((i) => i.name === 'userId')?.value;
    const isProcedure = propertyValues.find((i) => i.name === 'isProcedure')?.value;
    if (!query) {
      throw new Error('Missing required parameter query');
    }
    if (!credentials) {
      throw new Error('Missing required parameter credentials');
    }
    if (!userId) {
      throw new Error('Missing required parameter userId');
    }
    if (isProcedure === undefined) {
      throw new Error('Missing required parameter isProcedure');
    }

    const requestRouter = moduleRef.get<RequestRouterService>(
      RequestRouterService,
      { strict: false },
    );

    const fetcher: MsSqlFetcher = (await requestRouter.getDataFetcher(
      userId,
      workflowExecution.workflow.organizationId,
      credentials,
    )) as any;
    const result = await fetcher.get({
      isProcedure,
      query,
    });

    return [
      {
        name: 'queryResult',
        value: result,
      },
    ];
  },
};
