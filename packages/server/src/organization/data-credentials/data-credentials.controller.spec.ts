import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationService } from '../organization.service';
import { DataCredentialsController } from './data-credentials.controller';
import { DataCredentialsService } from './data-credentials.service';

describe('DataCredentialsController', () => {
  let controller: DataCredentialsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataCredentialsController],
      providers: [
        { provide: DataCredentialsService, useValue: {} },
        { provide: OrganizationService, useValue: {} }
      ]
    }).compile();

    controller = module.get<DataCredentialsController>(DataCredentialsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
