import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from "express"
import { getDefaultRoles } from "./get-default-roles"


@Injectable()
export class RolesGuard implements CanActivate {

  defaultRoles = getDefaultRoles();
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    let roles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) {
      roles = this.defaultRoles;
    }
    const request = context.switchToHttp().getRequest() as Request;
    const user = request.firebaseUser;
    const forbiddenRoles = roles.filter(r => r.startsWith('not-')).map(r => r.replace('not-', ''));
    if (forbiddenRoles.length > 0 && forbiddenRoles.some(r => user['ac' + r] === true)) {
      return false;
    }
    const requireOneOfRoles = roles.filter(r => !r.startsWith('not-'));
    return requireOneOfRoles.length === 0 || requireOneOfRoles.some(r => user['ac' + r] === true);
  }
}
