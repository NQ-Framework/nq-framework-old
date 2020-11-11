import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { LoggerService } from '../../logger/logger.service';
import { getFirebaseApp } from "../../firebase/initialize";
import { CronJob } from 'cron';
import { ScheduledJob, ConfigurationInterface } from "@nqframework/models"

@Injectable()
export class SchedulerService {
    constructor(private logger: LoggerService, private registry: SchedulerRegistry) {
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
            this.logger.warn("removing scheduled job " + name);
            job.stop();
            this.registry.deleteCronJob(name);
        });

        newJobData.forEach(newJob => {
            if (!newJob.active) {
                return;
            }

            this.logger.warn("creating scheduled job " + newJob.name + " : " + JSON.stringify(newJob));
            const job = new CronJob(newJob.cronInterval, () => {
                if (newJob.configuration.type === "log") {
                    this.logger.debug(newJob.configuration.message);
                }
            });
            this.registry.addCronJob(newJob.name, job);
            job.start();
        });
    }
}
