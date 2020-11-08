import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { CompanyDataSourceService } from './company-data-source/company-data-source.service';

@Module({
  imports: [LoggerModule],
  providers: [CompanyDataSourceService],
  exports: [CompanyDataSourceService]
})
export class CompanyModule { }
