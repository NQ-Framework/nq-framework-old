import { ScheduledJob } from '@nqframework/models';
import { generateJobName } from "./generate-job-name"

describe('Generate job name', () => {

    it('generates the name', () => {
        const job: ScheduledJob = {
            name: 'test-name',
            organizationId: 'test-org-id'
        } as any;
        expect(generateJobName(job)).toEqual('test-org-id:test-name');
    })
});