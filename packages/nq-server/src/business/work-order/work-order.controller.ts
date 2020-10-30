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
        // if (this.connector.has(user.uid)) {
        //     this.connector.send(user.uid, 'pong!');
        //     return { message: 'ping request successful' };
        // } else {
        //     throw new HttpException(
        //         { message: 'Supplied user id has no active connector session' },
        //         HttpStatus.BAD_REQUEST,
        //     );
    }
}
