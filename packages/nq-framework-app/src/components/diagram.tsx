import { Box } from "@chakra-ui/react";
import { Workflow } from "@nqframework/models";
import * as React from "react";
import { useCallback } from "react";
import ReactFlow, { Background, BackgroundVariant, Node } from 'react-flow-renderer';
import { WorkflowService } from "../services/workflow.service";
import { DiagramElement } from "../types/DiagramElement";

const service: WorkflowService = new WorkflowService();
// const elements = [
//     {
//         id: '1',
//         type: 'input', // input node
//         data: { label: 'Input Node' },
//         position: { x: 250, y: 25 },
//     },
//     // default node
//     {
//         id: '2',
//         // you can also pass a React component as a label
//         data: { label: <div>Default Node</div> },
//         position: { x: 100, y: 125 },
//     },
//     {
//         id: '3',
//         type: 'output', // output node
//         data: { label: 'Output Node' },
//         position: { x: 250, y: 250 },
//     },
//     // animated edge
//     { id: 'e1-2', source: '1', target: '2', animated: true },
//     // { id: 'e2-3', source: '2', target: '3' },
// ];


export const Diagram: React.FC<{ workflow: Workflow }> = ({ workflow }) => {
    const elements = mapActionsToDiagramElements(workflow).concat(mapActionLinksToDiagramElements(workflow)).concat(mapTriggersToDiagramElements(workflow));

    const nodeDragStop = useCallback(async (e: React.MouseEvent, node: Node) => {
        console.log('what do we have here ', node);
        await service.updateWorkflowNodePositions([{
            id: node.id,
            type: node.type === "input" ? "trigger" : "actionInstance",
            x: node.position.x,
            y: node.position.y
        }])
    }, []);

    return (
        <Box width="100%" height="100%">
            <ReactFlow elements={elements as any} onNodeDragStop={nodeDragStop} >
                <Background
                    variant={BackgroundVariant.Lines}
                    gap={18}
                    size={4}
                />
            </ReactFlow>
        </Box>
    )
}


function mapTriggersToDiagramElements(workflow: Workflow): DiagramElement[] {
    if (!workflow || !workflow.triggers || workflow.triggers.length === 0) {
        return [];
    }

    return workflow.triggers.reduce(
        (elements: DiagramElement[], trigger) => {
            elements.push({
                id: trigger.id,
                type: "input",
                data: { label: trigger.type.toUpperCase() + " Trigger" },
                style: { backgroundColor: trigger.editorConfig.color },
                position: { x: trigger.editorConfig.x, y: trigger.editorConfig.y },
            });
            trigger.actions.forEach(ac => elements.push({
                id: trigger.id + ac,
                source: trigger.id,
                target: ac,
                arrowHeadType: "arrowclosed",
                animated: true
            }));
            return elements;
        },
        []
    )
}
function mapActionsToDiagramElements(workflow: Workflow): DiagramElement[] {
    if (!workflow || !workflow.actionInstances || workflow.actionInstances.length === 0) {
        return [];
    }

    return workflow.actionInstances.map(ai => ({
        id: ai.name,
        data: { label: ai.name },
        style: { backgroundColor: ai.editorConfig.color, opacity: 1 },
        position: { x: ai.editorConfig.x, y: ai.editorConfig.y }
    }));
}
function mapActionLinksToDiagramElements(workflow: Workflow): DiagramElement[] {
    if (!workflow || !workflow.actionLinks || workflow.actionLinks.length === 0) {
        return [];
    }

    return workflow.actionLinks.map(al => ({
        id: al.fromName + al.toName,
        source: al.fromName,
        target: al.toName,
        arrowHeadType: 'arrowclosed',
        animated: true,
    }));
}