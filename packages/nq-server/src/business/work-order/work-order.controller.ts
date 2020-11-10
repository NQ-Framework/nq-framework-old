import { Controller, Get, Query, Req } from '@nestjs/common';
import { auth } from 'firebase-admin';
import { RequestRouterService } from '../../db-connection/request-router/request-router.service';
import { MsSqlFetcher } from "@nq-framework/data-fetcher"

@Controller('work-order')
export class WorkOrderController {
  constructor(private router: RequestRouterService) { }

  @Get('')
  async documents(
    @Req() req: any,
    @Query('organizationId') organizationId: string,
    @Query('dataSource') dataSource: string,
  ): Promise<{ data: any }> {
    const user = req.firebaseUser as auth.DecodedIdToken;
    const response = await this.router.getDataFetcher(
      user.uid,
      organizationId,
      dataSource,
    ) as MsSqlFetcher;
    const data = await response.get({
      isProcedure: false,
      query: "select * from tblUser_Info",
    });
    return { data };
  }
}
