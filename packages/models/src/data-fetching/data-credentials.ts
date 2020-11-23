import { PropertyValue } from "../workflow/property/property-value";
import { DataCredentialsType } from "./data-credentials-type";

export interface DataCredentials {
    name: string,
    configuration: {
        properties: PropertyValue[]
    },
    credentialsType: DataCredentialsType
}