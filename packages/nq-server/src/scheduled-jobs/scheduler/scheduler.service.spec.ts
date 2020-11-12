import { SchedulerRegistry } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '../../logger/logger.module';
import { HandlerService } from '../handler/handler.service';
import { SchedulerService } from './scheduler.service';
import { getFirebaseJobsObservable } from "./get-firebase-jobs-observable";
import { from } from 'rxjs';
import { JobsService } from '../jobs/jobs.service';
jest.mock('./get-firebase-jobs-observable');

describe('SchedulerService', () => {
  let service: SchedulerService;
  const deleteJobsMock = jest.fn().mockImplementation(() => Promise.resolve());
  const createJobsMock = jest.fn().mockImplementation(() => { return; });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [SchedulerService,
        { provide: SchedulerRegistry, useValue: {} },
        { provide: HandlerService, useValue: {} },
        {
          provide: JobsService, useValue: {
            deleteExistingJobs: deleteJobsMock,
            createJobs: createJobsMock
          }
        }],
    }).compile();

    service = module.get<SchedulerService>(SchedulerService);
  });

  it('should load jobs from firebase fetcher', async () => {
    (getFirebaseJobsObservable as jest.Mock).mockImplementation(() => {
      return from([[{ active: true }], [{ active: false }], [{ active: true }]])
    })
    await service.initialize();
    expect(getFirebaseJobsObservable).toHaveBeenCalledTimes(1);
    expect(deleteJobsMock).toHaveBeenCalledTimes(3);
    expect(deleteJobsMock).toHaveBeenNthCalledWith(1, [{ active: true }]);
    expect(createJobsMock).toHaveBeenCalledTimes(3);
    expect(createJobsMock).toHaveBeenNthCalledWith(1, [{ active: true }]);
    expect(createJobsMock).toHaveBeenNthCalledWith(2, []);
  });
});
