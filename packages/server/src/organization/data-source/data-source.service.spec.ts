import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '../../logger/logger.module';
import { DataSourceService } from './data-source.service';
const mockMembers = [1, 2, 3];
const mockDataSources = [4, 5, 6];
jest.mock('../../firebase/initialize', () => ({
  getFirebaseApp: () => ({
    firestore: () => ({
      doc: (organizationId: string) => ({
        get: () => {
          if (organizationId.includes('non-existent')) {
            return { exists: false };
          }
          return {
            exists: true,
            data: () => ({
              members: mockMembers,
              dataSources: mockDataSources,
            }),
          };
        },
      }),
    }),
  }),
}));

describe('DataSourceService', () => {
  let service: DataSourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [DataSourceService],
    }).compile();

    service = module.get<DataSourceService>(DataSourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should throw for non existent organization id', async () => {
    await expect(
      service.getDataSourceConfigurations('test non-existent organization id'),
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should return organization configuration data', async () => {
    await expect(
      service.getDataSourceConfigurations('test organization id'),
    ).resolves.toEqual({
      members: mockMembers,
      dataSources: mockDataSources,
    });
  });
});
