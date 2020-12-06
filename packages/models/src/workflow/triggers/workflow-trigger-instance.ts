import { EditorNode } from "../editor/editor-node";
import { PropertyValue } from "../property/property-value";

export interface WorkflowTriggerInstance {
  id: string;
  input: PropertyValue[];
  output: PropertyValue[];
  actions: string[];
  type: "api";
  editorConfig: EditorNode;
}
