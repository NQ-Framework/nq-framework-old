/* eslint-disable @typescript-eslint/no-namespace */
import * as admin from 'firebase-admin';
import { AuthConfigService } from '../config/AuthConfigService';

let firebaseApp;
export function loadFirebase(config: AuthConfigService): admin.app.App {
  if (firebaseApp) {
    return firebaseApp;
  }
  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: config.projectId,
      privateKey: config.privateKey.replace(/\\n/g, '\n'),
      clientEmail: config.clientEmail,
    }),
  });
  return firebaseApp;
}

declare global {
  namespace Express {
    interface Request {
      firebaseUser: admin.auth.DecodedIdToken;
    }
  }
}
