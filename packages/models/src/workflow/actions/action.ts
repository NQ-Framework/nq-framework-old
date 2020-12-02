import { Property } from "../property/property";
import { ActionPort } from "./action-port";

export interface Action {
  name: string;
  id: string;
  path: string;
  version: number;
  properties?: Property[];
  outputFields?: Property[];
  isEnabled: boolean;
  hasDefaultPort: boolean;
  additionalPorts?: ActionPort[];
}
