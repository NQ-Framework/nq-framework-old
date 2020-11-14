import { Test, TestingModule } from '@nestjs/testing';
import { ConnectorServerService } from './connector-server.service';

describe('ConnectionService', () => {
  let service: ConnectorServerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConnectorServerService],
    }).compile();

    service = module.get<ConnectorServerService>(ConnectorServerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
