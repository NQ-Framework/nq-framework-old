import { Test, TestingModule } from '@nestjs/testing';
import { ConnectorGatewayGateway } from './connector-gateway.gateway';

describe('ConnectorGatewayGateway', () => {
  let gateway: ConnectorGatewayGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConnectorGatewayGateway],
    }).compile();

    gateway = module.get<ConnectorGatewayGateway>(ConnectorGatewayGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
