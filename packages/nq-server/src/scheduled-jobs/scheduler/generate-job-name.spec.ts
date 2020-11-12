import { ScheduledJob } from '@nqframework/models';
import { generateJobId } from "./generate-job-id"

describe('Generate job name', () => {

    it('generates the name', () => {
        const job: ScheduledJob = {
            name: 'test-name',
            id: 1,
            organizationId: 'test-org-id'
        } as any;
        expect(generateJobId(job)).toEqual('test-org-id:1');
    })
});