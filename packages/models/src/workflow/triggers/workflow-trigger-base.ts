import { PropertyValue } from "../property/property-value";

export interface WorkflowTriggerBase {
    input: PropertyValue[];
    type: string;
}