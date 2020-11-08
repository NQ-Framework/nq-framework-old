import { Module } from '@nestjs/common';
import { RequestRouterService } from './request-router/request-router.service';
import { ConnectorGatewayGateway } from './gateway/connector-gateway.gateway';
import { ConnectorServerService } from './connector-server/connector-server.service';
import { LoggerModule } from '../logger/logger.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { CompanyModule } from 'src/company/company.module';

@Module({
  imports: [LoggerModule, AnalyticsModule, CompanyModule],
  providers: [RequestRouterService, ConnectorGatewayGateway, ConnectorServerService],
  exports: [RequestRouterService]
})
export class DbConnectionModule { }
