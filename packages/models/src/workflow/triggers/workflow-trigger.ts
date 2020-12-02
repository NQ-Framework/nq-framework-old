import { Property } from "../property/property";

export interface WorkflowTrigger {
  name: string;
  type: "api";
  description: "";
  color: string;
  properties: Property[];
  isEnabled: boolean;
  handler: string;
}
