import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics/analytics.service';
import { AppController } from './app.controller';
import { OrganizationService } from './organization/organization.service';

describe('AppController', () => {
  let appController: AppController;
  // let organizationService: OrganizationService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: AnalyticsService, useValue: { trackEvent: jest.fn() } },
        {
          provide: OrganizationService,
          useValue: { getOrganizationsForUserId: jest.fn() },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    // organizationService = app.get<OrganizationService>(OrganizationService);
  });

  it('should exist', () => {
    expect(appController).toBeDefined();
  });
  // it('should return user profile', () => {
  //   const mock = (organizationService.getOrganizationsForUserId as jest.Mock);
  //   mock.mockImplementation(() => ({
  //     serviceAccount: { name: 'test SA' }
  //   }));
  //   expect(
  //     appController.getProfile({ firebaseUser: { name: 'test' } }),
  //   ).toEqual({ name: 'test' });

  //   expect(
  //     appController.getProfile({ serviceAccount: { name: 'test SA' } }),
  //   ).toEqual({ name: 'test SA' });
  // });
});
