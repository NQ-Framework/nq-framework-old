import { Controller, Get, Query, Req } from '@nestjs/common';
import { auth } from 'firebase-admin';
import { RequestRouterService } from '../../db-connection/request-router/request-router.service';
import { MsSqlFetcher } from '@nq-framework/data-fetcher';
import { TYPES } from 'tedious';

@Controller('work-order')
export class WorkOrderController {
  constructor(private router: RequestRouterService) {}

  @Get('')
  async documents(
    @Req() req: any,
    @Query('organizationId') organizationId: string,
    @Query('dataSource') dataSource: string,
  ): Promise<{ data: any }> {
    const user = req.firebaseUser as auth.DecodedIdToken;
    const response = (await this.router.getDataFetcher(
      user.uid,
      organizationId,
      dataSource,
    )) as MsSqlFetcher;
    const data = await response.get({
      isProcedure: true,
      query: 'testProc',
      params: [{ name: 'TestParam', type: TYPES.Int, value: 10 }],
      outParams: [{ name: 'TestOut', type: TYPES.Int }],
    });
    return { data };
  }

  @Get('anything')
  async getAnything(
    @Req() req: any,
    @Query('organizationId') organizationId: string,
    @Query('dataSource') dataSource: string,
    @Query('isProcedure') isProcedure: string,
    @Query('query') query: string,
  ): Promise<{ data: any }> {
    const user = req.firebaseUser as auth.DecodedIdToken;
    const response = (await this.router.getDataFetcher(
      user.uid,
      organizationId,
      dataSource,
    )) as MsSqlFetcher;
    const data = await response.get({
      isProcedure: isProcedure === 'yes' || isProcedure === 'true',
      query,
      params: [],
      outParams: [],
    });
    return { data };
  }
}
