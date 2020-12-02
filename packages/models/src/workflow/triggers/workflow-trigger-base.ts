import { EditorNode } from "../editor/editor-node";
import { PropertyValue } from "../property/property-value";

export interface WorkflowTriggerBase {
  id: string;
  input: PropertyValue[];
  actions: string[];
  type: string;
  editorConfig: EditorNode;
}
