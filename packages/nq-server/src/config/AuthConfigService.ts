import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthConfigService {
  constructor(private config: ConfigService) {}

  get projectId(): string {
    return this.config.get('auth.projectId');
  }
  get privateKey(): string {
    return this.config.get('auth.privateKey');
  }
  get clientEmail(): string {
    return this.config.get('auth.clientEmail');
  }
}
