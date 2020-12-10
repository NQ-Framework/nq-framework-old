// import { loadFirebase } from './initialize';
// import * as dotenv from 'dotenv';

// dotenv.config();

// const app = loadFirebase({
//   projectId: 'nq-framework',
//   clientEmail: 'firebase-adminsdk-6116k@nq-framework.iam.gserviceaccount.com',
//   privateKey:
//     '',
// } as any);

// const map = Object.keys(TYPES).map(k=>{
//   return {name: k, value: k}
// });

// app
//   .firestore()
//   .doc('organizations/livona')
//   .get()
//   .then((doc) => {
//     const data = doc.data();
//     if (doc.exists && data) {
//       app
//         .firestore()
//         .doc('organizations/livona--uat')
//         .create(data)
//         .then((res) => {
//           console.log('success! ', res);
//         });
//     }
//   })
//   .catch((err) => {
//     console.error(err);
//   });

// app.firestore().doc('actions/Ucvy1A1vpSXpXNtmpB49').get().then(doc=>{
//   const data = doc.data();
//   if (!data) {
//     return;
//   }

// const newProp: Property = {
//   name: 'Type',
//   description: 'Parameter Type',
//   options: {
//     visible: true,
//     required: true,
//   },
//   type: "select-one",
//   selectOptions: map,
// }

//   data.properties[3].objectDefinition.push(newProp);

//   app.firestore().doc('actions/Ucvy1A1vpSXpXNtmpB49').update(data).then(()=>{
//     console.log('success!');
//   }).catch(err=>{
//     console.error(err);
//   });
// });

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
