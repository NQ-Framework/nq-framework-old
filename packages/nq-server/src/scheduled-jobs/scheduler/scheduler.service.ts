import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { LoggerService } from '../../logger/logger.service';
import { CronJob } from 'cron';
import { ScheduledJob } from "@nqframework/models"
import { HandlerService } from '../handler/handler.service';
import { generateJobName } from "./generate-job-name";
import { getFirebaseJobsObservable } from './get-firebase-jobs-observable';

@Injectable()
export class SchedulerService {
    constructor(private logger: LoggerService, private registry: SchedulerRegistry, private handler: HandlerService) {
        this.logger.setContext("Scheduler");
    }
    async initialize() {
        this.logger.debug('Initializing Scheduling service');

        const jobs = await getFirebaseJobsObservable();
        jobs.subscribe(async (changes) => {
            await this.synchronizeJobsData(changes as ScheduledJob[]);
        });
    }


    async synchronizeJobsData(jobsData: ScheduledJob[]) {
        await this.deleteExistingJobs(jobsData);

        this.createJobs(jobsData.filter(job => job.active));
    }

    private createJobs(jobsData: ScheduledJob[]) {
        jobsData.forEach(job => {

            const jobName = generateJobName(job);
            const configuration = job.configuration;

            this.logger.log(`creating scheduled job '${jobName}' as ${JSON.stringify(job)}`);

            const handler = this.handler.GetHandlerFromConfig(configuration);

            if (handler === null) {
                this.logger.error(`Could not load job handler. Job will not be created. requested job type: '${configuration.type}'  details: ${JSON.stringify(job)}`);
                return;
            }

            const invokeHandler = () => {
                handler.ExecuteJob(job.configuration, job);
            }

            const cronJob = new CronJob(job.cronInterval, invokeHandler);

            this.registry.addCronJob(jobName, cronJob);

            cronJob.start();
            this.logger.log(`Started job: '${jobName}'`);
        });
    }

    private async deleteExistingJobs(jobsData: ScheduledJob[]) {
        const jobList = (await this.registry.getCronJobs()) as Map<string, CronJob>;
        jobList.forEach((job, name) => {
            const newData = jobsData.find(j => generateJobName(j) === name);
            if (!newData) {
                return;
            }
            this.logger.log(`removing scheduled job '${name}'`);
            job.stop();
            this.registry.deleteCronJob(name);
        });
    }
}
