import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('api')
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('profile')
  getProfile(@Req() req): string {
    return req.firebaseUser;
  }
}
