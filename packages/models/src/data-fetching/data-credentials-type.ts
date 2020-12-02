import { Property } from "../workflow/property/property";

export interface DataCredentialsType {
  type: string;
  name: string;
  description: string;
  properties: Property[];
  isEnabled: boolean;
}
