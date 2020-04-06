import firebase from '../firebase/initialize';
import { Controller, Get, Res, Req } from '@nestjs/common';
import { Response } from "nestjs-sse"
import { AuthConfigService } from '../config/AuthConfigService';
import { Request } from 'express';

@Controller('actions')
export class ActionsController {
    constructor(private config: AuthConfigService) { }
    @Get("recieve")
    async ReceiveActions(@Req() req: Request, @Res() res: Response) {
        const token = req.query.token;
        if (!token) {
            this.rejectConnection(res);
        }
        const firebaseUser = await firebase(this.config)
            .auth()
            .verifyIdToken(token)
            .catch(err => {
                this.rejectConnection(res, err);
            });
        console.log('valid firebase user', firebaseUser);

        res.on('close', () => {
            console.log('ode ovaj!');
        });
    }


    private sendData(res: Response, data: string) {
        res.sse(`data: ${data}\n\n`);
    }
    private rejectConnection(res: Response, err?: Error) {
        res.sse(`data: Unauthorized. Please supply valid token for authentication as a query parameter. ${err ? JSON.stringify(err) : ''}\n\n`);
        res.end();
    }
}
