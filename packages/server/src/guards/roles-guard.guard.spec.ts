import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  it('should deny if user has no role', () => {
    const guard = new RolesGuard({ getAllAndOverride: jest.fn().mockImplementation(() => ['mockrole']) } as any);
    const canActivate = guard.canActivate({
      getHandler: () => 'handler' as any,
      getClass: () => 'class' as any,
      switchToHttp: () => ({
        getRequest: () => ({ firebaseUser: {} } as any)
      } as any)
    } as any);
    expect(canActivate).toBeFalsy();
  });
  it('should allow if user has role', () => {
    const guard = new RolesGuard({ getAllAndOverride: jest.fn().mockImplementation(() => ['mockrole']) } as any);
    const canActivate = guard.canActivate({
      getHandler: () => 'handler' as any,
      getClass: () => 'class' as any,
      switchToHttp: () => ({
        getRequest: () => ({ firebaseUser: { acmockrole: true } } as any)
      } as any)
    } as any);
    expect(canActivate).toBeTruthy();
  });

  it('should apply default roles if no roles defined for handler', () => {
    const guard = new RolesGuard({ getAllAndOverride: jest.fn().mockImplementation(() => null) } as any);
    const canActivate = guard.canActivate({
      getHandler: () => 'handler' as any,
      getClass: () => 'class' as any,
      switchToHttp: () => ({
        getRequest: () => ({ firebaseUser: {} } as any)
      } as any)
    } as any);
    expect(canActivate).toBeTruthy();
  });

  it('should deny if user has forbidden role', () => {
    const guard = new RolesGuard({ getAllAndOverride: jest.fn().mockImplementation(() => ['not-mockrole']) } as any);
    const canActivate = guard.canActivate({
      getHandler: () => 'handler' as any,
      getClass: () => 'class' as any,
      switchToHttp: () => ({
        getRequest: () => ({ firebaseUser: { acmockrole: true } } as any)
      } as any)
    } as any);
    expect(canActivate).toBeFalsy();
  });
});
