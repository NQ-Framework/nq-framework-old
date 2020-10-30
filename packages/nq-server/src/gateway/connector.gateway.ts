import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthConfigService } from '../config/AuthConfigService';
import { loadFirebase } from '../firebase/initialize';

@WebSocketGateway()
export class ConnectorGateway implements OnGatewayConnection {

  @WebSocketServer()
  socketServer: Server | undefined;
  pendingResponsePromises: { uid: string, resolve: Function }[] = [];

  constructor(private config: AuthConfigService) { }
  @SubscribeMessage('data-response')
  handleEvent(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): string {
    return "ok";
  }

  async handleConnection(client: Socket, ...args: any[]) {
    const token = client?.request?._query?.token || '';
    if (!token) {
      client.disconnect();
    }
    try {
      const decodedToken = await loadFirebase(this.config)
        .auth()
        .verifyIdToken(token);
      console.log('got a valid token!', decodedToken.uid);
      client.join(`connector:${decodedToken.uid}`);
      client.on('data-response', data => {
        this.pendingResponsePromises.find(prp => prp.uid === decodedToken.uid)?.resolve(data);
        this.pendingResponsePromises = this.pendingResponsePromises.filter(prp => prp.uid !== decodedToken.uid);
      });

    } catch (err) {
      console.log('invalid token');
      client.disconnect();
    }
  }

  public executeAndReply(uid: string, query: string): Promise<any> {
    this.socketServer?.to(`connector:${uid}`).emit('data-request', query);
    const promise = new Promise((resolve, reject) => {
      this.pendingResponsePromises.push({ uid: uid, resolve });
    });
    return promise;
  }
}
