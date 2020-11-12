import { getFirebaseApp } from './initialize';
import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { Request, Response } from 'express';

@Injectable()
export class FirebaseAuthMiddleware implements NestMiddleware {
  async use(req: Request, _: Response, next: Function) {
    const { authorization } = req.headers;
    if (!authorization) {
      this.throwError();
    }
    const token = authorization.slice(7); // Bearer <token>
    const app = await getFirebaseApp();
    const user = await app
      .auth()
      .verifyIdToken(token)
      .catch((err) => {
        this.throwError(err);
      });

    req.firebaseUser = user;
    next();
  }
  private throwError(err?: Error): never {
    throw new HttpException(
      { message: 'Failed authorization', err },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
