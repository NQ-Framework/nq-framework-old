import { loadFirebase } from './initialize';
import { AuthConfigService } from '../config/AuthConfigService';
jest.mock('firebase-admin', () => ({
  __esModule: true,
  credential: {
    cert: jest.fn(),
  },
  initializeApp: jest.fn(),
}));

import * as admin from 'firebase-admin';
import { config } from 'rxjs';

describe('firebase', () => {
  it('should create or return a firebase instance', () => {
    const configObj: any = {
      projectId: 'project id',
      privateKey: 'private key',
      clientEmail: 'client email',
    };
    (admin.initializeApp as jest.Mock).mockReturnValue({});
    loadFirebase(configObj);
    expect(admin.credential.cert).toHaveBeenCalledWith(
      expect.objectContaining(configObj),
    );

    loadFirebase(configObj);
    expect(admin.initializeApp).toHaveBeenCalledTimes(1);
  });
});
