import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { DataSourceService } from './data-source/data-source.service';
import { OrganizationService } from './organization.service';

@Module({
  imports: [CoreModule],
  providers: [DataSourceService, OrganizationService],
  exports: [DataSourceService, OrganizationService],
})
export class Organization { }
