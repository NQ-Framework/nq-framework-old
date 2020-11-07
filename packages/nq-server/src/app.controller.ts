import { Controller, Get, Req } from '@nestjs/common';
import { AnalyticsService } from './analytics/analytics.service';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly analytics: AnalyticsService,
  ) {}

  @Get('api')
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('profile')
  getProfile(@Req() req: any): string {
    this.analytics.trackEvent(req.firebaseUser.uid, {
      events: [{ name: 'item_view' }],
    });
    return req.firebaseUser;
  }
}
