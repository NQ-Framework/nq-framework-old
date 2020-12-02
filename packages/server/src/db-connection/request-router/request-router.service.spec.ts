import { Test, TestingModule } from '@nestjs/testing';
import { RequestRouterService } from './request-router.service';
import { CoreModule } from '../../core/core.module';
import { OrganizationService } from '../../organization/organization.service';
import { mockOrganization } from '../../workflow/mocks/mock-organization';

jest.mock('@nqframework/data-fetcher');

describe('RequestRouterService', () => {
  let service: RequestRouterService;
  let organization: OrganizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CoreModule],
      providers: [
        RequestRouterService,
        {
          provide: OrganizationService,
          useValue: { getOrganization: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<RequestRouterService>(RequestRouterService);
    organization = module.get<OrganizationService>(OrganizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should throw Unauthorized error when organization id is non existent', async () => {
    const mock = organization.getOrganization as jest.Mock;
    mock.mockImplementation(() => null);
    await expect(
      service.getDataFetcher(
        'user id',
        'non-existent organization id',
        'credentials-name',
      ),
    ).rejects.toThrowError('Unauthorized');
  });
  it('should throw Unauthorized error when user id not in members of organization config', async () => {
    const mock = organization.getOrganization as jest.Mock;
    mock.mockImplementation(() => null);
    await expect(
      service.getDataFetcher(
        'unauthorized user id',
        'organization id',
        'credentials-name',
      ),
    ).rejects.toThrowError('Unauthorized');
  });

  it('should throw No credentials error when requested credentials are not found', async () => {
    const mock = organization.getOrganization as jest.Mock;
    mock.mockImplementation(() => mockOrganization);
    await expect(
      service.getDataFetcher(
        'mock user id',
        'organization id',
        'non-existent credentials',
      ),
    ).rejects.toThrowError('No credentials available to fill request');
  });

  it('TEMP should throw no fetcher error when requested data source is remote', async () => {
    const mock = organization.getOrganization as jest.Mock;
    mock.mockImplementation(() => mockOrganization);
    await expect(
      service.getDataFetcher(
        'mock user id',
        'organization id',
        'remote credentials',
      ),
    ).rejects.toThrowError('An appropriate fetcher could not be obtained');
  });

  it('should return fetcher from factory when direct access fetcher is requested', async () => {
    const mock = organization.getOrganization as jest.Mock;
    mock.mockImplementation(() => mockOrganization);
    await expect(
      service.getDataFetcher('mock user id', 'organization id', 'credentials'),
    ).resolves.not.toThrow();
  });
});
