import { ConfigurationInterface } from '@nqframework/models';

export abstract class BaseJobService {
    abstract ExecuteJob(config: ConfigurationInterface): void
}
