import { ScheduledJob } from '@nqframework/models';

export const generateJobId = (job: ScheduledJob): string => {
    return job.organizationId + ':' + job.id;
}