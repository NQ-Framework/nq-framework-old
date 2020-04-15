import { loadFirebase } from '../firebase/initialize';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { Controller, Get, Res, Req, Post, HttpStatus } from '@nestjs/common';
import { Response } from '@irreal/nestjs-sse';
import { AuthConfigService } from '../config/AuthConfigService';
import { Request } from 'express';
import { ConnectorService } from '../connector/connector.service';
import { auth } from 'firebase-admin';

@Controller('actions')
export class ActionsController {
  constructor(
    private config: AuthConfigService,
    private connector: ConnectorService,
  ) {}
  @Get('recieve')
  async ReceiveActions(@Req() req: Request, @Res() res: Response) {
    const token = req.query.token as string;
    if (!token) {
      this.rejectConnection(res);
    }
    try {
      const decodedToken = await loadFirebase(this.config)
        .auth()
        .verifyIdToken(token);

      this.connector.add(decodedToken.uid, res);

      res.on('close', () => {
        this.connector.remove(decodedToken.uid);
      });
    } catch (err) {
      this.rejectConnection(res, err);
    }
  }

  @Post('ping')
  ping(@Req() req: any): string {
    const user = req.firebaseUser as auth.DecodedIdToken;
    if (this.connector.has(user.uid)) {
      this.connector.send(user.uid, 'pong!');
      return 'ping request successful';
    } else {
      throw new HttpException(
        { message: 'Supplied user id has no active connector session' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // private sendData(res: Response, data: string) {
  //   res.sse(`data: ${data}\n\n`);
  // }

  private rejectConnection(res: Response, err?: Error) {
    res.sse(
      `data: Unauthorized. Please supply valid token for authentication as a query parameter. ${
        err ? err.message : ''
      }\n\n`,
    );
    res.end();
  }
}
