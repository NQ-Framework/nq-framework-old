import { PropertyValue } from "../property/property-value";
import { Action } from "./action";

export interface ActionInstance {
    id: string,
    action: Action,
    configuration: {
        input: PropertyValue[]
        output: PropertyValue[]
    }
}