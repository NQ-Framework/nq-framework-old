import { PropertyValue } from "../workflow/property/property-value";
import { DataCredentials } from "./data-credentials";

export interface DataCredentialsInstance {
    name: string,
    configuration: {
        properties: PropertyValue[]
    },
    credentialsDefinition: DataCredentials
}