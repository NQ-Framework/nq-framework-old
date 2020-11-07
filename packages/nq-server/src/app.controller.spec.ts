import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics/analytics.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, { provide: AnalyticsService, useValue: { trackEvent: jest.fn() } }],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should return "Hello World!"', () => {
    expect(appController.getHello()).toBe('Hello World!');
  });

  it('should return user profile', () => {
    expect(
      appController.getProfile({ firebaseUser: { name: 'test' } }),
    ).toEqual({ name: 'test' });
  });
});
