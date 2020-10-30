import { Test, TestingModule } from '@nestjs/testing';
import { AuthConfigService } from '../config/AuthConfigService';
import { ConnectorGateway } from './connector.gateway';

describe('ConnectorGatewayGateway', () => {
  let gateway: ConnectorGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConnectorGateway,
        { provide: AuthConfigService, useValue: {} }],
    }).compile();

    gateway = module.get<ConnectorGateway>(ConnectorGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
