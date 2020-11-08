import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { DataSourceService } from './data-source/data-source.service';

@Module({
  imports: [LoggerModule],
  providers: [DataSourceService],
  exports: [DataSourceService]
})
export class Organization { }
