import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { DataSourceService } from './data-source/data-source.service';

@Module({
  imports: [CoreModule],
  providers: [DataSourceService],
  exports: [DataSourceService],
})
export class Organization { }
