import { Organization } from '@nqframework/models';

export const mockOrganization: Organization = {
    name: "mock org id",
    members: [{
        displayName: "mock display name",
        email: "mock@email.com",
        role: "admin",
        status: "accepted",
        uid: "mock user id"
    }],
    memberIds: ["mock user id"],
    address1: "addr1",
    address2: "addr2",
    country: "ctry",
    dataCredentials: [],
    email: "mock-org@email.com",
    serviceAccounts: [],
    dataSources: []
}