import { PropertyValue } from "../workflow/property/property-value";
import { DataCredentialsType } from "./data-credentials-type";

export interface DataCredentials {
  name: string;
  configuration: PropertyValue[];
  isRemote: boolean;
  credentialsType: DataCredentialsType;
}
