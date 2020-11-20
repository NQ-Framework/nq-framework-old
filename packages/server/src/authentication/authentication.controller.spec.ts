import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let authService: AuthenticationService;
  const mockToken = {
    email: "mock@mock",
    idToken: "mocktoken",
    refreshToken: "mockrefresh",
    expiresIn: "mockexpires",
    localId: "mockid"
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        { provide: AuthenticationService, useValue: { loginUserWithEmailAndPassword: jest.fn() } }
      ]
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
    authService = module.get<AuthenticationService>(AuthenticationService);
  });

  it('should reject login calls if no input parameters', async () => {
    await expect(controller.UserLogin('', '')).rejects.toThrowErrorMatchingSnapshot();
    await expect(controller.ServiceAccountLogin('', '')).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should call service and return result for service account', async () => {
    const loginMock = authService.loginUserWithEmailAndPassword as jest.Mock;
    loginMock.mockImplementation(() => {
      return mockToken
    });
    const result = await controller.ServiceAccountLogin('mock email', 'mock pw');

    expect(loginMock).toBeCalledWith('mock email', 'mock pw');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email, localId, ...expected } = mockToken;
    expect(result).toEqual(expected);
  });

  it('should call service and return result for user account', async () => {
    const loginMock = authService.loginUserWithEmailAndPassword as jest.Mock;
    loginMock.mockImplementation(() => {
      return mockToken
    });
    const result = await controller.UserLogin('mock email', 'mock pw');

    expect(loginMock).toBeCalledWith('mock email', 'mock pw');

    expect(result).toEqual(mockToken);
  });
});
