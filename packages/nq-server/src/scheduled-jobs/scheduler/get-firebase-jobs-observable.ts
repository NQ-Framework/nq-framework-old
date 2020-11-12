import { ScheduledJob } from '@nqframework/models';
import { Observable, Subject } from 'rxjs';
import { getFirebaseApp } from '../../firebase/initialize';

export const getFirebaseJobsObservable = async (): Promise<
  Observable<ScheduledJob[]>
> => {
  const subj = new Subject<ScheduledJob[]>();
  const app = await getFirebaseApp();
  app
    .firestore()
    .collection('scheduledJobs')
    .onSnapshot(async (snap) => {
      const changes = snap.docChanges().map((d) => {
        const data = d.doc.data();
        return { ...data, active: d.type === 'removed' ? false : data.active };
      });
      subj.next(changes as ScheduledJob[]);
    });
  return subj;
};
