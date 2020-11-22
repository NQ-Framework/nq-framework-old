import { Controller, Get, Req } from '@nestjs/common';
import { AnalyticsService } from './analytics/analytics.service';
import { Request } from "express";
import { OrganizationService } from './organization/organization.service';

@Controller()
export class AppController {
  constructor(private readonly analytics: AnalyticsService, private organizationService: OrganizationService) { }

  @Get('profile')
  async getProfile(@Req() req: Request): Promise<any> {
    if (req.firebaseUser) {
      this.analytics.trackEvent(req.firebaseUser.uid, {
        events: [{ name: 'item_view' }],
      });
      const organizations = await this.organizationService.getOrganizationsForUserId(req.firebaseUser.uid);
      return { user: req.firebaseUser, organizations: organizations };
    }
    return req.serviceAccount;
  }
}
