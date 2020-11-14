import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { LoggerService } from '../../logger/logger.service';
import { CronJob } from 'cron';
import { ScheduledJob } from '@nqframework/models';
import { HandlerService } from '../../job-handler/handler.service';
import { generateJobId } from '../scheduler/generate-job-id';

@Injectable()
export class JobsService {
  constructor(
    private logger: LoggerService,
    private registry: SchedulerRegistry,
    private handler: HandlerService,
  ) {
    this.logger.setContext('Scheduler');
  }

  createJobs(jobsData: ScheduledJob[]) {
    jobsData.forEach((job) => {
      const jobId = generateJobId(job);
      const jobDescription = job.organizationId + ': ' + job.name;

      this.logger.log(
        `creating scheduled job '${jobDescription}' as ${JSON.stringify(job)}`,
      );

      const handler = this.handler.getHandlerFromConfig(job.configuration);
      if (!handler) {
        this.logger.error(
          `Could not load job handler. Job will not be created. requested job type: '${job.configuration.type
          }'  details: ${JSON.stringify(job)}`,
        );
        return;
      }

      const invokeHandler = async () => {
        try {
          await this.handler.executeJob(job);
        }
        catch (error) {
          this.logger.error('Error executing scheduled job.', error);
        }
      };

      const cronJob = new CronJob(job.cronInterval, invokeHandler);

      this.registry.addCronJob(jobId, cronJob);

      cronJob.start();
      this.logger.log(`Started schedueld job: '${jobDescription}'`);
    });
  }

  async deleteExistingJobs(jobsData: ScheduledJob[]) {
    const jobList = (await this.registry.getCronJobs()) as Map<string, CronJob>;
    jobList.forEach((job, id) => {
      const newData = jobsData.find((j) => generateJobId(j) === id);
      if (!newData) {
        return;
      }
      this.logger.log(`removing scheduled job '${id}'`);
      job.stop();
      this.registry.deleteCronJob(id);
    });
  }
}
