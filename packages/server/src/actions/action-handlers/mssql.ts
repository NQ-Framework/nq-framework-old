import {
  ActionHandler,
  ActionInstance,
  PropertyValue,
  reducePropertyValuesToObject,
  WorkflowExecutionContext,
} from '@nqframework/models';
import { ModuleRef } from '@nestjs/core';
import { RequestRouterService } from '../../db-connection/request-router/request-router.service';
import { MsSqlFetcher } from '@nqframework/data-fetcher';
import { TYPES } from "tedious"

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
    const inputParameters = propertyValues.find((i) => i.name === 'inputParameters')?.value;
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


      const parameters = inputParameters.map((ip:any)=> ({...reducePropertyValuesToObject(ip.value), type: TYPES.NVarChar}));
      console.log(parameters);

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
      params: parameters
    });

    return [
      {
        name: 'queryResult',
        value: result,
      },
    ];
  },
};
