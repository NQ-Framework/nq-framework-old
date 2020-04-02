import { Module } from '@nestjs/common';
import { AuthConfigService } from './AuthConfigService';

@Module({
  providers: [AuthConfigService],
  exports: [AuthConfigService],
})
export class ConfiugrationModule {}
