import { ScheduledJob } from '@nqframework/models';

export const generateJobDescription = (job: ScheduledJob): string => {
  return job.organizationId + ': ' + job.name;
};
