import { Organization } from '@nqframework/models';

export const mockOrganization: Organization = {
  name: 'mock org id',
  members: [
    {
      displayName: 'mock display name',
      email: 'mock@email.com',
      role: 'admin',
      status: 'accepted',
      uid: 'mock user id',
    },
  ],
  memberIds: ['mock user id'],
  address1: 'addr1',
  address2: 'addr2',
  country: 'ctry',
  dataCredentials: [
    {
      configuration: [],
      credentialsType: {
        description: 'mock credentials description',
        name: 'mock credentials',
        isEnabled: true,
        properties: [],
        type: 'mssql',
      },
      isRemote: false,
      name: 'credentials',
    },
    {
      name: 'remote credentials',
      isRemote: true,
      configuration: [],
      credentialsType: {
        description: 'mock remote description',
        isEnabled: true,
        name: 'mock remote credentials type name',
        properties: [],
        type: 'mssql-remote',
      },
    },
  ],
  email: 'mock-org@email.com',
  serviceAccounts: [],
  dataSources: [],
};
