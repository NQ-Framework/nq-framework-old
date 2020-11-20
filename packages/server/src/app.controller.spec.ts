import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics/analytics.service';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: AnalyticsService, useValue: { trackEvent: jest.fn() } },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should return user profile', () => {
    expect(
      appController.getProfile({ firebaseUser: { name: 'test' } }),
    ).toEqual({ name: 'test' });

    expect(
      appController.getProfile({ serviceAccount: { name: 'test SA' } }),
    ).toEqual({ name: 'test SA' });
  });
});
