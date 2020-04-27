export interface OrganizationMember {
  displayName: string;
  uid: string;
  email: string;
  status: "invited" | "accepted" | "removed";
}
