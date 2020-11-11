import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { LoggerService } from '../../logger/logger.service';
import { getFirebaseApp } from "../../firebase/initialize";
import { CronJob } from 'cron';
import { ScheduledJob } from "@nqframework/models"
import { HandlerService } from '../handler/handler.service';

@Injectable()
export class SchedulerService {
    constructor(private logger: LoggerService, private registry: SchedulerRegistry, private handler: HandlerService) {
        this.logger.setContext("Scheduler");
    }
    async initialize() {
        this.logger.debug('Initializing Scheduling service');
        const app = await getFirebaseApp();
        app.firestore().collection('scheduledJobs').onSnapshot(async (snap) => {
            const changes = snap.docChanges().map(d => {
                const data = d.doc.data();
                return { ...data, active: d.type === "removed" ? false : data.active };
            });
            await this.applyJobData(changes as ScheduledJob[]);
        });
    }


    async applyJobData(newJobData: ScheduledJob[]) {
        const jobList = (await this.registry.getCronJobs()) as Map<string, CronJob>;
        jobList.forEach((job, name) => {
            const newData = newJobData.find(j => j.name === name);
            if (!newData) {
                return;
            }
            this.logger.log(`removing scheduled job '${name}'`);
            job.stop();
            this.registry.deleteCronJob(name);
        });

        newJobData.forEach(newJob => {
            if (!newJob.active) {
                return;
            }

            this.logger.log(`creating scheduled job '${newJob.name}' as ${JSON.stringify(newJob)}`);
            const handler = this.handler.GetJobHandler(newJob.configuration);
            if (!handler) {
                this.logger.error(`Could not load job handler. Job will not be created. requested job type: '${newJob.configuration.type}'`);
                return;
            }
            const job = new CronJob(newJob.cronInterval, () => {
                handler.ExecuteJob(newJob.configuration);
            });
            this.registry.addCronJob(newJob.name, job);
            job.start();
            this.logger.log(`Started job: '${newJob.name}'`);
        });
    }
}
