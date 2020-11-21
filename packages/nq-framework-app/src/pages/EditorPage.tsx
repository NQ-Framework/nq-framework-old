import * as React from "react";
import { Box, Drawer, DrawerContent, DrawerHeader, GridItem, Text, useDisclosure } from "@chakra-ui/react";
import { Diagram } from "../components/diagram";
import { Layout } from "../components/layout";
import { useCallback, useEffect, useMemo, useState } from "react";
import { WorkflowService } from "../services/workflow.service";
import { Action, Workflow } from "@nqframework/models";
import { ActionsService } from "../services/actions.service";
import { Toolbox } from "../components/toolbox";
import { SelectionChange } from "../types/SelectionChange";
import { FlowTransform, OnLoadParams } from "react-flow-renderer";

export const EditorPage: React.FC = () => {
    const workflowService = useMemo(() => new WorkflowService(), []);
    const [workflow, setWorkflow] = useState<Workflow | null>(null);
    const [selected, setSelected] = useState<SelectionChange>([]);
    const { isOpen, onOpen, onClose } = useDisclosure()

    const onLoad = useCallback((params: OnLoadParams) => {
        const fromStorage = localStorage.getItem("flowTransform");
        if (fromStorage) {
            const parsed = JSON.parse(fromStorage);
            params.setTransform(parsed);
        }
    }, []);

    const addAction = useCallback(
        (action: Action) => {
            workflowService.addActionToWorkflow(action.id).then((workflow) => {
                setWorkflow(workflow);
            });
        },
        [workflowService, setWorkflow]
    );

    const removeAction = useCallback(
        (actionName: string) => {
            workflowService.removeActionFromWorkflow(actionName).then((workflow) => {
                setWorkflow(workflow);
            });
        },
        [workflowService, setWorkflow]
    );

    const changeSelection = useCallback(
        (selection: SelectionChange) => {
            setSelected(selection);
            if (selection.length === 0) {
                onClose();
            }
            else {
                onOpen();
            }
        }, [setSelected, onOpen, onClose]
    )

    const moveEnd = useCallback((transform: FlowTransform | undefined) => {
        localStorage.setItem('flowTransform', JSON.stringify(transform));
    }, [])

    const addConnection = useCallback(
        (from: string, to: string) => {
            workflowService.linkActionNodes(from, to).then((workflow) => {
                setWorkflow(workflow);
            });
        },
        [workflowService, setWorkflow]
    );

    const [actions, setActions] = useState<Action[] | null>(null);

    useEffect(() => {
        workflowService.getWorkflow().then((wf) => {
            setWorkflow(wf);
        });
        const actionsService = new ActionsService();
        actionsService.getAll().then((ac) => {
            setActions(ac);
        });
    }, [workflowService]);
    return (
        <Layout>
            <GridItem padding={6}>
                <Toolbox actions={actions || []} addAction={addAction} />
                <Drawer
                    isOpen={isOpen}
                    placement="right"
                    onClose={onClose}
                    size="md"
                >
                    <DrawerContent opacity="0.95" background="gray.200">
                        <DrawerHeader>Action Properties</DrawerHeader>
                    </DrawerContent>
                </Drawer>
                {/* <Box>Selected: {selected.map(s => <Text key={s.id}>{s.id}</Text>)}</Box> */}
            </GridItem>
            <GridItem>
                {workflow ? (
                    <Diagram
                        removeActionName={removeAction}
                        workflow={workflow!}
                        addConnection={addConnection}
                        changeSelection={changeSelection}
                        onMoveEnd={moveEnd}
                        onLoad={onLoad}
                    />
                ) : (
                        <Text>No workflow :(</Text>
                    )}
            </GridItem>
        </Layout>
    );
};
