import { HttpModule, Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { ConfiugrationModule } from '../config/configuration.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

@Module({
  imports: [HttpModule, ConfiugrationModule, CoreModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService]
})
export class AuthenticationModule { }
