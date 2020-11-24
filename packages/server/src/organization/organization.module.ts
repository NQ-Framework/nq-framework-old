import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { DataSourceService } from './data-source/data-source.service';
import { OrganizationService } from './organization.service';
import { DataCredentialsController } from './data-credentials/data-credentials.controller';
import { DataCredentialsService } from './data-credentials/data-credentials.service';

@Module({
  imports: [CoreModule],
  providers: [DataSourceService, OrganizationService, DataCredentialsService],
  exports: [DataSourceService, OrganizationService],
  controllers: [DataCredentialsController],
})
export class Organization { }
