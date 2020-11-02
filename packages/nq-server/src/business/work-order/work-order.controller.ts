import { Controller, Get, Query, Req } from '@nestjs/common';
import { auth } from 'firebase-admin';
import { ConnectorGateway } from '../../gateway/connector.gateway';


@Controller('work-order')
export class WorkOrderController {

    constructor(private gateway: ConnectorGateway) { }

    @Get('sql')
    async query(@Req() req: any, @Query('query') query: string): Promise<{ data: any }> {
        console.log('ubada');
        const user = req.firebaseUser as auth.DecodedIdToken;
        const response = await this.gateway.executeAndReply(user.uid, query);
        return { data: response }
    }
}
