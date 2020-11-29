import { PropertyOptions } from "./property-options";
import { PropertyType } from "./property-type";
import { PropertyValue } from "./property-value";

export interface Property {
    name: string;
    description: string;
    type: PropertyType;
    objectDefinition?: Property[],
    arrayType?: PropertyType
    options?: PropertyOptions;
    selectOptions?: PropertyValue[];
    defaultValue?: any;
}