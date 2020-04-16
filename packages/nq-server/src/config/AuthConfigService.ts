import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthConfigService {
  constructor(private config: ConfigService) {}

  get projectId(): string {
    return this.config.get('auth.projectId') ?? this.throwError('project id');
  }
  get privateKey(): string {
    return this.config.get('auth.privateKey') ?? this.throwError('private key');
  }
  get clientEmail(): string {
    return this.config.get('auth.clientEmail') ?? this.throwError('cl email');
  }
  private throwError(param: string): never {
    throw new Error(`missing configuration item: ${param}`);
  }
}
