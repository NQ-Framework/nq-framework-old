import { ScheduledJob, ConfigurationInterface } from '@nqframework/models';

export abstract class BaseJobService {
  abstract ExecuteJob(config: ConfigurationInterface, job: ScheduledJob): void;
}
