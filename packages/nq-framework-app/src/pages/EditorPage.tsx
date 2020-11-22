import * as React from "react";
import { GridItem, Heading, Text } from "@chakra-ui/react";
import { Diagram } from "../components/diagram";
import { Layout } from "../components/layout";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { WorkflowService } from "../services/workflow.service";
import { Action, Workflow } from "@nqframework/models";
import { ActionsService } from "../services/actions.service";
import { Toolbox } from "../components/toolbox";
import { FlowTransform, OnLoadParams } from "react-flow-renderer";
import { AuthContext, initPromise } from "../firebase/firebase-context";
import { Redirect, useParams } from "react-router-dom";
import { organizationContext } from "../core/organization-context";

export const EditorPage: React.FC = () => {
    const workflowService = useMemo(() => new WorkflowService(), []);
    const user = useContext(AuthContext);
    const { organization } = useContext(organizationContext);
    const [workflow, setWorkflow] = useState<Workflow | null>(null);
    // const [selected, setSelected] = useState<SelectionChange>([]);
    // const { isOpen, onOpen, onClose } = useDisclosure()

    const [fbInit, setFbInit] = useState(false);

    const { workflowId } = useParams<{ workflowId: string }>();

    const onLoad = useCallback((params: OnLoadParams) => {
        const fromStorage = localStorage.getItem("flowTransform" + workflowId);
        if (fromStorage) {
            const parsed = JSON.parse(fromStorage);
            params.setTransform(parsed);
        }
    }, [workflowId]);


    const addAction = useCallback(
        (action: Action) => {
            workflowService.addActionToWorkflow(workflowId, action.id, organization?.name ?? "").then((workflow) => {
                setWorkflow(workflow);
            });
        },
        [workflowService, setWorkflow, workflowId, organization]
    );

    const removeAction = useCallback(
        (actionName: string) => {
            workflowService.removeActionFromWorkflow(workflowId, actionName, organization?.name ?? "").then((workflow) => {
                setWorkflow(workflow);
            });
        },
        [workflowService, setWorkflow, workflowId, organization]
    );

    // const changeSelection = useCallback(
    //     (selection: SelectionChange) => {
    //         setSelected(selection);
    //     }, [setSelected]
    // )

    const moveEnd = useCallback((transform: FlowTransform | undefined) => {
        localStorage.setItem('flowTransform' + workflowId, JSON.stringify(transform));
    }, [workflowId])

    const addConnection = useCallback(
        (from: string, to: string) => {
            workflowService.linkActionNodes(workflowId, from, to, organization?.name ?? "").then((workflow) => {
                setWorkflow(workflow);
            });
        },
        [workflowService, setWorkflow, workflowId, organization]
    );

    const [actions, setActions] = useState<Action[] | null>(null);

    useEffect(() => {
        initPromise.then(() => {
            setFbInit(true);
            if (!user) {
                return;
            }
            workflowService.getWorkflow(workflowId, organization?.name ?? "").then((wf) => {
                setWorkflow(wf);
            });
            const actionsService = new ActionsService();
            actionsService.getAll().then((ac) => {
                setActions(ac);
            });
        });
    }, [workflowService, user, workflowId, organization]);

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
                                    // changeSelection={changeSelection}
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
