import { Box } from "@chakra-ui/react";
import { Workflow } from "@nqframework/models";
import * as React from "react";
import { useCallback, useContext } from "react";
import ReactFlow, {
    Background,
    BackgroundVariant,
    Connection,
    Edge,
    Elements,
    FlowTransform,
    Node,
    OnLoadParams,
} from "react-flow-renderer";
import { organizationContext } from "../core/organization-context";
import { WorkflowService } from "../services/workflow.service";
import { DiagramElement } from "../types/DiagramElement";

const service: WorkflowService = new WorkflowService();
export const Diagram: React.FC<{
    workflow: Workflow;
    removeActionName: (actionName: string) => void;
    addConnection: (from: string, to: string) => void;
    changeSelection: (elements: Elements) => void;
    onMoveEnd: (transform: FlowTransform | undefined) => void;
    onLoad: (loadParams: OnLoadParams) => void;
    workflowId: string
}> = ({ workflow, removeActionName, addConnection, changeSelection, onMoveEnd, onLoad, workflowId }) => {
    const elements = mapActionsToDiagramElements(workflow)
        .concat(mapActionLinksToDiagramElements(workflow))
        .concat(mapTriggersToDiagramElements(workflow));

    const { organization } = useContext(organizationContext);
    const nodeDragStop = useCallback(async (e: React.MouseEvent, node: Node) => {
        await service.updateWorkflowNodePositions(workflowId, [
            {
                id: node.id,
                type: node.type === "input" ? "trigger" : "actionInstance",
                x: node.position.x,
                y: node.position.y,
            },
        ], organization?.name ?? "");
    }, [workflowId, organization]);

    return (
        <Box width="100%" height="100%">
            <ReactFlow
                elements={elements as any}
                onNodeDragStop={nodeDragStop}
                onElementsRemove={(e: Elements) => {
                    removeActionName(e[0].id);
                }}
                onConnect={(e: Connection | Edge) => {
                    if (e.source && e.target) {
                        addConnection(e.source, e.target);
                    }
                }}
                onMoveEnd={(e) => { onMoveEnd(e); }}
                onLoad={(e) => { onLoad(e); }}
                onElementClick={(event, element) => { changeSelection(element ? [element] : []) }}
            >
                <Background variant={BackgroundVariant.Lines} gap={18} size={4} />
            </ReactFlow>
        </Box >
    );
};

function mapTriggersToDiagramElements(workflow: Workflow): DiagramElement[] {
    if (!workflow || !workflow.triggers || workflow.triggers.length === 0) {
        return [];
    }

    return workflow.triggers.reduce((elements: DiagramElement[], trigger) => {
        elements.push({
            id: trigger.id,
            type: "input",
            data: { label: trigger.type.toUpperCase() + " Trigger" },
            style: { backgroundColor: trigger.editorConfig.color },
            position: { x: trigger.editorConfig.x, y: trigger.editorConfig.y },
        });
        trigger.actions.forEach((ac) =>
            elements.push({
                id: trigger.id + ac,
                source: trigger.id,
                target: ac,
                arrowHeadType: "arrowclosed",
                animated: true,
            })
        );
        return elements;
    }, []);
}
function mapActionsToDiagramElements(workflow: Workflow): DiagramElement[] {
    if (
        !workflow ||
        !workflow.actionInstances ||
        workflow.actionInstances.length === 0
    ) {
        return [];
    }

    return workflow.actionInstances.map((ai) => ({
        id: ai.name,
        data: { label: ai.name },
        style: { backgroundColor: ai.editorConfig.color, opacity: 1 },
        position: { x: ai.editorConfig.x, y: ai.editorConfig.y },
    }));
}
function mapActionLinksToDiagramElements(workflow: Workflow): DiagramElement[] {
    if (!workflow || !workflow.actionLinks || workflow.actionLinks.length === 0) {
        return [];
    }

    return workflow.actionLinks.map((al) => ({
        id: al.fromName + al.toName,
        source: al.fromName,
        target: al.toName,
        arrowHeadType: "arrowclosed",
        animated: true,
    }));
}
