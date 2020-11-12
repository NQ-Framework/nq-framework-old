import { ScheduledJob } from '@nqframework/models';

export const generateJobName = (jobData: ScheduledJob): string => {
    return jobData.organizationId + ':' + jobData.name;
}