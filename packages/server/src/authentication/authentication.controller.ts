import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';

@Controller('authentication')
export class AuthenticationController {
  constructor(private service: AuthenticationService) {}

  @Post('user')
  async UserLogin(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    if (!email || !password) {
      throw new BadRequestException('Missing user credentials in body');
    }
    const token = await this.service.loginUserWithEmailAndPassword(
      email,
      password,
    );
    return {
      email: token.email,
      idToken: token.idToken,
      refreshToken: token.refreshToken,
      expiresIn: token.expiresIn,
      localId: token.localId,
    };
  }

  @Post('token')
  async ServiceAccountLogin(
    @Body('client_id') email: string,
    @Body('client_secret') password: string,
  ) {
    if (!email || !password) {
      throw new BadRequestException('Invalid client credentials in body');
    }
    const token = await this.service.loginUserWithEmailAndPassword(
      email,
      password,
    );
    return {
      idToken: token.idToken,
      refreshToken: token.refreshToken,
      expiresIn: token.expiresIn,
    };
  }
}
