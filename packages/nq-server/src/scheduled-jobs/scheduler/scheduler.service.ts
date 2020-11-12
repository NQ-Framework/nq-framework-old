import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';
import { ScheduledJob } from '@nqframework/models';
import { getFirebaseJobsObservable } from './get-firebase-jobs-observable';
import { JobsService } from '../jobs/jobs.service';

@Injectable()
export class SchedulerService {
  constructor(private logger: LoggerService, private jobs: JobsService) {
    this.logger.setContext('Scheduled Jobs');
  }
  async initialize() {
    this.logger.debug('Initializing Scheduling service');

    const jobs = await getFirebaseJobsObservable();
    jobs.subscribe(async (changes) => {
      await this.synchronizeJobsData(changes as ScheduledJob[]);
    });
  }

  async synchronizeJobsData(jobsData: ScheduledJob[]) {
    await this.jobs.deleteExistingJobs(jobsData);

    this.jobs.createJobs(jobsData.filter((job) => job.active));
  }
}
