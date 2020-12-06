import { Property } from "../property/property";

export interface WorkflowTrigger {
  name: string;
  type: "api";
  description: "";
  color: string;
  inputProperties: Property[];
  outputProperties: Property[];
  isEnabled: boolean;
  handler: string;
}
