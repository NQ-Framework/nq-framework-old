import { Module } from '@nestjs/common';
import { ConfiugrationModule } from '../config/configuration.module';
import { ConnectorGateway } from './connector.gateway';

@Module({
    providers: [ConnectorGateway],
    exports: [ConnectorGateway],
    imports: [ConfiugrationModule]
})
export class GatewayModule { }
