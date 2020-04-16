import { Injectable } from '@nestjs/common';
import { Response } from '@irreal/nestjs-sse';

@Injectable()
export class ConnectorService {
  responseMap: any = {};
  add(id: string, res: Response) {
    this.responseMap[id] = res;
  }
  get(id: string): Response | undefined {
    if (!(id in this.responseMap)) {
      return undefined;
    }
    return this.responseMap[id] as Response;
  }

  has(id: string): boolean {
    return this.responseMap[id] !== undefined;
  }

  remove(id: string) {
    delete this.responseMap[id];
  }

  send(id: string, data: any) {
    const res = this.get(id);
    if (res === undefined) {
      throw new Error("Can't send data to a non existing client");
    }
    res.sse(`data: ${data}\n\n`);
    res.end(); //awful workaround to support running on google cloud run until HTTP Streaming is enabled
  }

  close(id: string) {
    const res = this.get(id);
    if (res === undefined) {
      throw new Error("Can't close connection to non existing client");
    }
    res.end();
  }
}
