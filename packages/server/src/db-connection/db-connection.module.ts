import { Module } from '@nestjs/common';
import { RequestRouterService } from './request-router/request-router.service';
import { ConnectorGateway } from './gateway/connector.gateway';
import { ConnectorServerService } from './connector-server/connector-server.service';
import { CoreModule } from '../core/core.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { Organization } from '../organization/organization.module';

@Module({
  imports: [CoreModule, AnalyticsModule, Organization],
  providers: [RequestRouterService, ConnectorGateway, ConnectorServerService],
  exports: [RequestRouterService],
})
export class DbConnectionModule { }
