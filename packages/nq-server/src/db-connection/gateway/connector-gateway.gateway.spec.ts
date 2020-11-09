import { Test, TestingModule } from '@nestjs/testing';
import { ConnectorGateway } from './connector.gateway';

describe('ConnectorGateway', () => {
  let gateway: ConnectorGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConnectorGateway],
    }).compile();

    gateway = module.get<ConnectorGateway>(ConnectorGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
