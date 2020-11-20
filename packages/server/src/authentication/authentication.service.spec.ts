import { HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { AuthConfigService } from '../config/AuthConfigService';
import { LoggerService } from '../core/logger.service';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let http: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: LoggerService,
          useValue: {
            setContext: jest.fn(),
            debug: jest.fn(),
            error: jest.fn(),
          },
        },
        { provide: HttpService, useValue: { post: jest.fn() } },
        { provide: AuthConfigService, useValue: {} },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
    http = module.get<HttpService>(HttpService);
  });

  it('should call http service', async () => {
    const postMock = http.post as jest.Mock;
    postMock.mockImplementation(() => {
      return of({ data: { testProp: 'test value' } });
    });
    const result = await service.loginUserWithEmailAndPassword(
      'mock email',
      'mock pw',
    );
    expect(postMock).toHaveBeenCalledWith(
      expect.stringContaining('signInWithPassword'),
      { email: 'mock email', password: 'mock pw', returnSecureToken: true },
      expect.any(Object),
    );
    expect(result).toEqual({ testProp: 'test value' });
  });

  it('throw if http service throws', async () => {
    const postMock = http.post as jest.Mock;
    postMock.mockImplementation(() => {
      throw new Error('test');
    });
    await expect(
      service.loginUserWithEmailAndPassword('mock email', 'mock pw'),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
});
