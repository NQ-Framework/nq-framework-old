/* eslint-disable @typescript-eslint/no-namespace */
import * as admin from 'firebase-admin';
import { AuthConfigService } from '../config/AuthConfigService';

let firebaseApp;
export default (config: AuthConfigService) =>
  firebaseApp
    ? firebaseApp
    : (firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: config.projectId,
          privateKey: config.privateKey.replace(/\\n/g, '\n'),
          clientEmail: config.clientEmail,
        }),
      }));

declare global {
  namespace Express {
    interface Request {
      firebaseUser: admin.auth.DecodedIdToken;
    }
  }
}
