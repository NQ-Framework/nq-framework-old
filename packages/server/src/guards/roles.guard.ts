import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest() as Request;
    const user = request.firebaseUser;
    if (!user) {
      return false;
    }
    const forbiddenRoles = roles
      .filter((r) => r.startsWith('not-'))
      .map((r) => r.replace('not-', ''));
    if (
      forbiddenRoles.length > 0 &&
      forbiddenRoles.some((r) => user['ac' + r] === true)
    ) {
      return false;
    }
    const requireOneOfRoles = roles.filter((r) => !r.startsWith('not-'));
    return (
      requireOneOfRoles.length === 0 ||
      requireOneOfRoles.some((r) => user['ac' + r] === true)
    );
  }
}
