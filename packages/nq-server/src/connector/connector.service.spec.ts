import { Test, TestingModule } from '@nestjs/testing';
import { ConnectorService } from './connector.service';
import { Response } from '@irreal/nestjs-sse';

describe('ConnectorService', () => {
  let service: ConnectorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConnectorService],
    }).compile();

    service = module.get<ConnectorService>(ConnectorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should store and retrieve response objects', () => {
    const res: any = {
      sse: () => {
        return 'sse';
      },
    };

    const res2: any = {
      sse: () => {
        return 'sse 2';
      },
    };
    service.add('test id', res);
    service.add('test id 2', res2);

    const resReturned = (service.get('test id') as any) as Response;
    expect(resReturned.sse('')).toEqual('sse');
    expect(resReturned).toEqual(res);

    const resReturned2 = (service.get('test id 2') as any) as Response;
    expect(resReturned2).toEqual(res2);
    expect(resReturned2.sse('')).toEqual('sse 2');
  });

  it('should return undefined for missing response objects', () => {
    expect(service.get('missing id')).toBeUndefined();
  });

  it('should replace the object if added twice with same id', () => {
    service.add('test id', { sse: () => 'test 1' } as any);
    expect(((service.get('test id') as any) as Response).sse('')).toEqual(
      'test 1',
    );
    service.add('test id', { sse: () => 'test 2' } as any);
    expect(((service.get('test id') as any) as Response).sse('')).toEqual(
      'test 2',
    );
  });

  it('should check if response is present', () => {
    expect(service.has('test id')).toEqual(false);
    service.add('test id', {} as any);
    expect(service.has('test id')).toEqual(true);
    service.remove('test id');
    expect(service.has('test id')).toEqual(false);
  });

  it('should send data to response object', (done) => {
    const res: any = {
      sse: (data: any) => {
        expect(data).toEqual('data: test\n\n');
        done();
      },
      end: () => {
        // this is a hack until google cloud run enables http streaming
      },
    };
    service.add('test id', res);
    service.send('test id', 'test');
  });

  it('should throw when sending data to non existing id', () => {
    expect(() => {
      service.send('test id', 'test');
    }).toThrowErrorMatchingSnapshot();
  });

  it('should close the connection', (done) => {
    const res: any = {
      end: () => {
        done();
      },
    };
    service.add('test id', res);
    service.close('test id');
  });

  it('kasot', () => {
    expect(() => {
      service.close('test id');
    }).toThrowErrorMatchingSnapshot();
  });
});
