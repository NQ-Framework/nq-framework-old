import { EditorNode } from "../editor/editor-node";
import { Action } from "./action";
import { ActionInstanceConfiguration } from "./action-instance-configuration";

export interface ActionInstance {
    name: string;
    action: Action;
    configuration: ActionInstanceConfiguration;
    isEnabled: boolean;
    editorConfig: EditorNode
}