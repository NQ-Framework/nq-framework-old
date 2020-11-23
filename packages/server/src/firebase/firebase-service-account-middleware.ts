import { getFirebaseApp } from './initialize';
import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { Request, Response } from 'express';
import { Organization } from '@nqframework/models';

@Injectable()
export class FirebaseServiceAccountMiddleware implements NestMiddleware {
  async use(req: Request, _: Response, next: Function) {
    const { authorization } = req.headers;
    if (!authorization) {
      this.throwError();
    }
    const token = authorization.slice(7); // Bearer <token>

    if (token.startsWith('SA1')) {
      if (!req.organizationId) {
        this.throwError();
      }

      const organization = await this.loadOrganization(req.organizationId);
      const acc =
        organization &&
        organization.serviceAccounts &&
        organization.serviceAccounts.find((sa) => sa.token === token.slice(3));
      if (!acc) {
        this.throwError();
      }
      req.serviceAccount = acc;
    }
    next();
  }
  private throwError(err?: Error): never {
    throw new HttpException(
      { message: 'Failed authorization', err },
      HttpStatus.UNAUTHORIZED,
    );
  }

  private async loadOrganization(
    organizationId: string,
  ): Promise<Organization> {
    const app = await getFirebaseApp();
    return (
      await app.firestore().doc(`organizations/${organizationId}`).get()
    ).data() as any;
  }
}
