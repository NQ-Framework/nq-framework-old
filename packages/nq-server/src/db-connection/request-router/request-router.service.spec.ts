import { Test, TestingModule } from '@nestjs/testing';
import { DataSourceService } from '../../organization/data-source/data-source.service';
import { RequestRouterService } from './request-router.service';
import { LoggerModule } from '../../logger/logger.module';

jest.mock('@nq-framework/data-fetcher');

const mockMembers = [
  {
    uid: 'user id',
  },
];

describe('RequestRouterService', () => {
  let service: RequestRouterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        RequestRouterService,
        {
          provide: DataSourceService,
          useValue: {
            getDataSourceConfigurations: (organizationId: string) => {
              if (organizationId.includes('non-existent')) {
                return null;
              }
              return {
                members: mockMembers,
                dataSources: [
                  {
                    handles: ['main-db'],
                    directAccess: true,
                  },
                  {
                    handles: ['remote-db'],
                    directAccess: false,
                  },
                ],
              };
            },
          },
        },
      ],
    }).compile();

    service = module.get<RequestRouterService>(RequestRouterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should throw Unauthorized error when organization id is non existent', async () => {
    await expect(
      service.getDataFetcher(
        'user id',
        'non-existent organization id',
        'main-db',
      ),
    ).rejects.toThrowError('Unauthorized');
  });
  it('should throw Unauthorized error when user id not in members of organization config', async () => {
    await expect(
      service.getDataFetcher(
        'unauthorized user id',
        'organization id',
        'main-db',
      ),
    ).rejects.toThrowError('Unauthorized');
  });

  it('should throw No data source error when requested data source is not found', async () => {
    await expect(
      service.getDataFetcher(
        'user id',
        'organization id',
        'non-existent data source',
      ),
    ).rejects.toThrowError('No data source available to fill request');
  });

  it('TEMP should throw no data source error when requested data source is remote', async () => {
    await expect(
      service.getDataFetcher('user id', 'organization id', 'remote-db'),
    ).rejects.toThrowError('An appropriate fetcher could not be obtained');
  });

  it('should return fetcher from factory when direct access fetcher is requested', async () => {
    await expect(
      service.getDataFetcher('user id', 'organization id', 'main-db'),
    ).resolves.not.toThrow();
  });
});
