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

  it('should replace the object if added twice with same id, ending the stored one', () => {
    const mockResponse = { sse: () => 'test 1', end:jest.fn() };
    service.add('test id', mockResponse as any);
    expect(((service.get('test id') as any) as Response).sse('')).toEqual(
      'test 1',
    );
    service.add('test id', { sse: () => 'test 2' } as any);
    expect(mockResponse.end).toHaveBeenCalledTimes(1);
    expect(((service.get('test id') as any) as Response).sse('')).toEqual(
      'test 2',
    );
  });

  it('should check if response is present', () => {
    const mockResponse : any = {end:jest.fn()};
    expect(service.has('test id')).toEqual(false);
    service.add('test id', mockResponse);
    expect(service.has('test id')).toEqual(true);
    service.close('test id', mockResponse);
    expect(service.has('test id')).toEqual(false);
  });

  it('should send data to response object', (done) => {
    const res: any = {
      sse: (data: any) => {
        expect(data).toEqual('data: test\n\n');
        done();
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
    service.close('test id', res);
    expect(service.has('test id')).toBeFalsy();
  });

  it ('should not close the connection if res was updated', ()=>{
    const res: any = {
      end: () => {},
    };
    const res2: any = {
      end:()=>{},
    }
    service.add('test id', res);
    service.add('test id', res2);
    service.close('test id', res);
    expect(service.has('test id')).toBeTruthy();
  });

  it('should throw when closing a non existing connection', () => {
    expect(() => {
      service.close('test id',{} as any);
    }).toThrowErrorMatchingSnapshot();
  });
});
