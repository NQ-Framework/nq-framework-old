import { Controller, Get, Req } from '@nestjs/common';
import { AnalyticsService } from './analytics/analytics.service';

@Controller()
export class AppController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Get('profile')
  getProfile(@Req() req: any): string {
    if (req.firebaseUser) {
      this.analytics.trackEvent(req.firebaseUser.uid, {
        events: [{ name: 'item_view' }],
      });
      return req.firebaseUser;
    }
    return req.serviceAccount;
  }
}
