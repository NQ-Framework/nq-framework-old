export interface UserToken {
  idToken: string;
  refreshToken: string;
  email: string;
  expiresIn: string;
  localId: string;
  registered: boolean;
}
