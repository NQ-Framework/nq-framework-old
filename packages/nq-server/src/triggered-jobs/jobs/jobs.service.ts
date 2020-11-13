import { Injectable } from '@nestjs/common';
import { TriggeredJob } from '@nqframework/models';
import { getFirebaseApp } from "../../firebase/initialize";

@Injectable()
export class JobsService {

    async findJob(jobId: string): Promise<TriggeredJob> {
        const app = await getFirebaseApp();
        const doc = await app.firestore().doc(`triggeredJobs/${jobId}`).get();
        if (!doc) {
            throw new Error('job with given id not found');
        }
        return doc.data() as TriggeredJob;
    }
}
