import { Test, TestingModule } from '@nestjs/testing';
import { ActionsController } from './actions.controller';
import { AuthConfigService } from '../config/AuthConfigService';
import { ConnectorService } from '../connector/connector.service';

jest.mock('../firebase/initialize', () => ({
  __esModule: true,
  loadFirebase: jest.fn(),
}));

import { loadFirebase } from '../firebase/initialize';

const mockResponse: any = {
  sse: jest.fn(),
  on: jest.fn(),
  end: jest.fn(),
};
const mockRequest: any = {
  query: {
    token: 'valid token',
  },
};

const mockConnector = { add: jest.fn(), remove: jest.fn() };
const mockAuth = {};
describe('Actions Controller', () => {
  let controller: ActionsController;

  beforeEach(async () => {
    (loadFirebase as jest.Mock).mockImplementation(() => ({
      auth: () => ({ verifyIdToken: () => ({ uid: 'test user id' }) }),
    }));
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActionsController],
      providers: [
        { provide: AuthConfigService, useValue: mockAuth },
        { provide: ConnectorService, useValue: mockConnector },
      ],
    }).compile();
    controller = module.get<ActionsController>(ActionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should reject connections without a token', (done) => {
    const reqWithoutToken: any = { query: {} };
    const resWithoutToken: any = {
      sse: (data: any) => {
        expect(data).toEqual(expect.stringContaining('Unauthorized'));
      },
      end: () => {
        done();
      },
    };
    controller.ReceiveActions(reqWithoutToken, resWithoutToken);
  });

  it('should reject connections with invalid tokens', (done) => {
    const reqWithInvalidToken: any = { query: { token: 'invalid token' } };
    const resWithInvalidToken: any = {
      sse: (data: any) => {
        expect(data).toEqual(expect.stringContaining('Unauthorized'));
        expect(data).toEqual(expect.stringContaining('invalid token'));
      },
      end: () => {
        done();
      },
    };
    (loadFirebase as jest.Mock).mockImplementation(() => {
      throw new Error('invalid token');
    });
    controller.ReceiveActions(reqWithInvalidToken, resWithInvalidToken);
  });

  it('should allow connections with valid token', (done) => {
    const reqWithValidToken: any = { query: { token: 'valid token' } };
    const resWithValidToken: any = {
      sse: (data: any) => {
        throw new Error(`should not send any data. Got: ${data}`);
      },
      end: () => {
        throw new Error('should not end connection');
      },
      on: () => {
        // nothing
      },
    };
    controller.ReceiveActions(reqWithValidToken, resWithValidToken);
    setTimeout(() => {
      done();
    }, 10);
  });

  it('should add response to connector, and remove on discoonnect', async () => {
    const spyAdd = jest.spyOn(mockConnector, 'add');
    const spyRemove = jest.spyOn(mockConnector, 'remove');
    let cb: any = undefined;
    mockResponse.on = (event: any, callback: any) => {
      expect(event).toEqual('close');
      cb = callback;
    };
    await controller.ReceiveActions(mockRequest, mockResponse);
    expect(cb).toBeDefined();
    expect(spyAdd).toHaveBeenCalledWith('test user id', mockResponse);
    cb();
    expect(spyRemove).toHaveBeenCalledWith('test user id');
  });
});
