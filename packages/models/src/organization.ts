import { OrganizationMember } from "./organization-member";

export interface Organization {
  name: string;
  email: string;
  address1: string;
  address2: string;
  country: string;
  members: OrganizationMember[];
}
