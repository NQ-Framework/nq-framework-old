import { ScheduledJob, ConfigurationInterface, TriggeredJob } from '@nqframework/models';

export abstract class BaseJobService {
  abstract ExecuteJob(config: ConfigurationInterface, job: ScheduledJob | TriggeredJob): any;
}
