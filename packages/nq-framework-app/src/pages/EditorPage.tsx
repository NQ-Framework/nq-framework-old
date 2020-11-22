import * as React from "react";
import { Box, Drawer, DrawerContent, DrawerHeader, GridItem, Heading, Text, useDisclosure } from "@chakra-ui/react";
import { Diagram } from "../components/diagram";
import { Layout } from "../components/layout";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { WorkflowService } from "../services/workflow.service";
import { Action, Workflow } from "@nqframework/models";
import { ActionsService } from "../services/actions.service";
import { Toolbox } from "../components/toolbox";
import { SelectionChange } from "../types/SelectionChange";
import { FlowTransform, OnLoadParams } from "react-flow-renderer";
import { AuthContext, initPromise } from "../firebase/firebase-context";
import { Redirect, useParams } from "react-router-dom";

export const EditorPage: React.FC = () => {
    const workflowService = useMemo(() => new WorkflowService(), []);
    const user = useContext(AuthContext);
    const [workflow, setWorkflow] = useState<Workflow | null>(null);
    const [selected, setSelected] = useState<SelectionChange>([]);
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [fbInit, setFbInit] = useState(false);

    const onLoad = useCallback((params: OnLoadParams) => {
        const fromStorage = localStorage.getItem("flowTransform");
        if (fromStorage) {
            const parsed = JSON.parse(fromStorage);
            params.setTransform(parsed);
        }
    }, []);

    const { workflowId } = useParams<{ workflowId: string }>();

    const addAction = useCallback(
        (action: Action) => {
            workflowService.addActionToWorkflow(workflowId, action.id).then((workflow) => {
                setWorkflow(workflow);
            });
        },
        [workflowService, setWorkflow, workflowId]
    );

    const removeAction = useCallback(
        (actionName: string) => {
            workflowService.removeActionFromWorkflow(workflowId, actionName).then((workflow) => {
                setWorkflow(workflow);
            });
        },
        [workflowService, setWorkflow, workflowId]
    );

    const changeSelection = useCallback(
        (selection: SelectionChange) => {
            setSelected(selection);
        }, [setSelected]
    )

    const moveEnd = useCallback((transform: FlowTransform | undefined) => {
        localStorage.setItem('flowTransform', JSON.stringify(transform));
    }, [])

    const addConnection = useCallback(
        (from: string, to: string) => {
            workflowService.linkActionNodes(workflowId, from, to).then((workflow) => {
                setWorkflow(workflow);
            });
        },
        [workflowService, setWorkflow, workflowId]
    );

    const [actions, setActions] = useState<Action[] | null>(null);

    useEffect(() => {
        initPromise.then(() => {
            setFbInit(true);
            if (!user) {
                return;
            }
            workflowService.getWorkflow(workflowId).then((wf) => {
                setWorkflow(wf);
            });
            const actionsService = new ActionsService();
            actionsService.getAll().then((ac) => {
                setActions(ac);
            });
        });
    }, [workflowService, user, workflowId]);

    if (!fbInit) {
        return <Heading>Loading...</Heading>
    }
    return (
        <>
            {!user ? (
                <Redirect to={{ pathname: "/signin" }} />
            ) : (
                    <Layout>
                        <GridItem padding={6}>
                            <Text>Naziv: {workflow?.name ?? ''}</Text>
                            <Toolbox actions={actions || []} addAction={addAction} />
                            {/* <Drawer
                                isOpen={isOpen}
                                placement="right"
                                onClose={onClose}
                                size="md"
                            >
                                <DrawerContent opacity="0.95" background="gray.200">
                                    <DrawerHeader>Action Properties</DrawerHeader>
                                </DrawerContent>
                            </Drawer> */}
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
                                    workflowId={workflowId}
                                />
                            ) : (
                                    <Text>No workflow :(</Text>
                                )}
                        </GridItem>
                    </Layout>
                )}
        </>
    );
};
