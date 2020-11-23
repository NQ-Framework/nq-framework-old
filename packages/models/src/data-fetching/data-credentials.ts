import { Property } from "../workflow/property/property";

export interface DataCredentials {
    id: string,
    type: string,
    name: string,
    description: string,
    properties: Property[],
    isEnabled: boolean
}