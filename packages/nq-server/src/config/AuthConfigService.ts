import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigServiceBase } from './ConfigServiceBase';

@Injectable()
export class AuthConfigService extends ConfigServiceBase {
  constructor(private config: ConfigService) { super(); }

  get projectId(): string {
    return this.config.get('auth.projectId') ?? this.throwError('project id');
  }
  get privateKey(): string {
    return this.config.get('auth.privateKey') ?? this.throwError('private key');
  }
  get clientEmail(): string {
    return this.config.get('auth.clientEmail') ?? this.throwError('cl email');
  }
}
