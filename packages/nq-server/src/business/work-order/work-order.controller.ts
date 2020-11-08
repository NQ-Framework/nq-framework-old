import { Controller, Get, Query, Req } from '@nestjs/common';
import { auth } from 'firebase-admin';
import { RequestRouterService } from '../../db-connection/request-router/request-router.service';

@Controller('work-order')
export class WorkOrderController {
  constructor(private router: RequestRouterService) { }

  @Get('')
  async documents(
    @Req() req: any,
    @Query('companyId') companyId: string,
    @Query('dataSource') dataSource: string,
  ): Promise<{ data: any }> {
    const user = req.firebaseUser as auth.DecodedIdToken;
    const response = await this.router.getDataFetcher(user.uid, companyId, dataSource);
    const data = await response.getData();
    return { data };
  }
}
