import { getOrganizationIdFromDomain } from './get-organization-id-from-domain';

describe('Get organization id from domain', () => {
  it('lowercases the org name', () => {
    expect(getOrganizationIdFromDomain('TeSt')).toEqual('test');
    expect(getOrganizationIdFromDomain('test')).toEqual('test');
    expect(getOrganizationIdFromDomain('TEST')).toEqual('test');
  });

  it('trims whitespace', () => {
    expect(getOrganizationIdFromDomain(' test ')).toEqual('test');
    expect(getOrganizationIdFromDomain('test ')).toEqual('test');
    expect(getOrganizationIdFromDomain(' test')).toEqual('test');
    expect(getOrganizationIdFromDomain('      test')).toEqual('test');
    expect(getOrganizationIdFromDomain('      test           ')).toEqual(
      'test',
    );
    expect(getOrganizationIdFromDomain('    test    ')).toEqual('test');
    expect(getOrganizationIdFromDomain('test test')).toEqual('test test');
  });
});
