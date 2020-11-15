import { Property } from "../property/property";

export interface Action {
    name: string;
    id: string;
    path: string;
    inputFields: Property[];
    outputFields: Property[];
}