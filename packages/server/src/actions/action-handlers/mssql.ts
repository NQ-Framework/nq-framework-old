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
    const dataSource = propertyValues.find((i) => i.name === 'dataSource')
      ?.value;
    const userId = propertyValues.find((i) => i.name === 'userId')?.value;
    if (!query) {
      throw new Error('Missing required parameter query');
    }
    if (!dataSource) {
      throw new Error('Missing required parameter dataSource');
    }
    if (!userId) {
      throw new Error('Missing required parameter userId');
    }

    const requestRouter = moduleRef.get<RequestRouterService>(
      RequestRouterService,
      { strict: false },
    );

    const fetcher: MsSqlFetcher = (await requestRouter.getDataFetcher(
      userId,
      workflowExecution.workflow.organizationId,
      dataSource,
    )) as any;
    const result = await fetcher.get({
      isProcedure: false,
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
