import * as React from "react";
import { Box, Drawer, DrawerContent, DrawerHeader, GridItem, Heading, Text, useDisclosure } from "@chakra-ui/react";
import { Diagram } from "../components/diagram";
import { Layout } from "../components/layout";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { WorkflowService } from "../services/workflow.service";
import { Action, ActionInstance, PropertyValue, Workflow, WorkflowTrigger } from "@nqframework/models";
import { ActionsService } from "../services/actions.service";
import { Toolbox } from "../components/toolbox";
import { Elements, FlowTransform, OnLoadParams } from "react-flow-renderer";
import { AuthContext, initPromise } from "../firebase/firebase-context";
import { Redirect, useParams } from "react-router-dom";
import { organizationContext } from "../core/organization-context";
import { ActionProperties } from "../components/action-properties";

export const EditorPage: React.FC = () => {
    const workflowService = useMemo(() => new WorkflowService(), []);
    const user = useContext(AuthContext);
    const { organization } = useContext(organizationContext);
    const [workflow, setWorkflow] = useState<Workflow | null>(null);
    const [selectedAction, setSelectedAction] = useState<{ instance: ActionInstance, action: Action } | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: false })

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

    const [actions, setActions] = useState<Action[]>([]);
    const [triggers, setTriggers] = useState<WorkflowTrigger[]>([]);

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
            actionsService.getAll(organization?.name ?? "").then((ac) => {
                setActions(ac);
            });
            actionsService.getAllTriggers(organization?.name ?? "").then((tg) => {
                setTriggers(tg);
            });
        });
    }, [workflowService, user, workflowId, organization]);

    useEffect(() => {
        if (!selectedAction) {
            onClose();
            return;
        }
        onOpen();
    }, [selectedAction, onClose, onOpen])
    const mapAction = useCallback((els: Elements) => {
        if (els.length === 0) {
            setSelectedAction(null);
            return;
        }
        const mappedActions = els.filter(el => el.type === "default").map(el => workflow?.actionInstances.find(ai => ai.name === el.id));
        if (mappedActions.length === 0) {
            return;
        }
        const mappedActionInstance = mappedActions[0]!;
        const actionDefinition = actions.find(a => a.id === mappedActionInstance.action.id);
        if (!actionDefinition) {
            return null;
        }
        setSelectedAction({ action: actionDefinition, instance: mappedActionInstance });
    }, [setSelectedAction, actions, workflow])

    const updateActionProperties = useCallback((actionInstanceName: string, propertyValues: PropertyValue[]) => {
        return workflowService.updateActionProperties(actionInstanceName, propertyValues, workflow?.id ?? "", organization?.name ?? "");
    }, [workflowService, organization, workflow]);

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
                            <Toolbox actions={actions} triggers={triggers} addAction={addAction} />
                            <Drawer
                                isOpen={isOpen}
                                placement="left"
                                onClose={onClose}
                                size="md"
                            >
                                <DrawerContent background="white">
                                    <ActionProperties selected={selectedAction} updateActionProperties={updateActionProperties} />
                                </DrawerContent>
                            </Drawer>
                            {/* <Box>Selected: {selected.map(s => <Text key={s.id}>{s.id} aha aha</Text>)}</Box> */}
                        </GridItem>
                        <GridItem background="white">
                            {workflow ? (
                                <Diagram
                                    removeActionName={removeAction}
                                    workflow={workflow!}
                                    addConnection={addConnection}
                                    changeSelection={mapAction}
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
