import { ScheduledJob } from '@nqframework/models';
import { generateJobDescription } from "./generate-job-description"

describe('Generate job description', () => {

    it('generates the description', () => {
        const job: ScheduledJob = {
            name: 'test-name',
            organizationId: 'test-org-id'
        } as any;
        expect(generateJobDescription(job)).toEqual('test-org-id: test-name');
    })
});