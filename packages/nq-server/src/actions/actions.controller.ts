import { loadFirebase } from '../firebase/initialize';
import { Controller, Get, Res, Req } from '@nestjs/common';
import { Response } from '@irreal/nestjs-sse';
import { AuthConfigService } from '../config/AuthConfigService';
import { Request } from 'express';
import { ConnectorService } from '../connector/connector.service';

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
