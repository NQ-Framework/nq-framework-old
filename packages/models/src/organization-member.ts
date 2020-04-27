export interface OrganizationMember {
  displayName: string;
  uid: string;
  email: string;
  status: "invited" | "accepted" | "removed";
  country: string;
  members: string[];
}
