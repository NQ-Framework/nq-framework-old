import { PropertyOptions } from "./property-options";
import { PropertyType } from "./property-type";

export interface Property {
    name: string;
    description: string;
    type: PropertyType;
    options?: PropertyOptions;
}