import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from './jobs.service';
import { getFirebaseApp } from "../../firebase/initialize"
import { TriggeredJob } from '@nqframework/models';
jest.mock("../../firebase/initialize");
const getFirebaseMock = getFirebaseApp as jest.Mock;

const mockJob: TriggeredJob = {
  name: 'triggered job',
  organizationId: 'mock org id',
  id: 'jobId'
} as any
getFirebaseMock.mockImplementation(() => {
  return {
    firestore: () => ({
      doc: (query: string) => {
        return {
          get: () => query === 'triggeredJobs/jobId' ? ({
            data: () => mockJob
          }) : null
        }
      }
    })
  }
});

describe('JobsService', () => {
  let service: JobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobsService],
    }).compile();

    service = module.get<JobsService>(JobsService);
  });

  it('should return a job by id', async () => {
    const job = await service.findJob('jobId');
    expect(job).toEqual(mockJob)
  });
  it('should throw for non existing job', async () => {
    await expect(service.findJob('invalid jobId')).rejects.toThrowErrorMatchingSnapshot();
  });
});
