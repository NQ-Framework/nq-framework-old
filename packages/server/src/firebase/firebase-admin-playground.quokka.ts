import { loadFirebase } from './initialize';
import * as dotenv from 'dotenv';

dotenv.config();

const app = loadFirebase({
  projectId: 'nq-framework',
  clientEmail: 'firebase-adminsdk-6116k@nq-framework.iam.gserviceaccount.com',
  privateKey: '',
} as any);

// app
//   .auth()
//   .createCustomToken('123', { claim1: 'asd qwe' })
//   .then((v) => {
//     console.log(v);
//   });
// const set = new Set<string>();
// for (let i = 0; i < 1000000; i++) {
//   set.add(app.firestore().collection('test').doc().id);
// }

// console.log(set.size);

// app
//   .auth()
//   .getUserByEmail('milos.s.pfc@gmail.com')
//   .then((user) => {
//     app
//       .auth()
//       .setCustomUserClaims(user.uid, {})
//       .then((resp) => {
//         console.log('jep', resp);
//       });
//   });
