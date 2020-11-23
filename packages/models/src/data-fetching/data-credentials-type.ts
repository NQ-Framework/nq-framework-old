import { Property } from "../workflow/property/property";

export interface DataCredentialsType {
    id: string,
    type: string,
    name: string,
    description: string,
    properties: Property[],
    isEnabled: boolean
}