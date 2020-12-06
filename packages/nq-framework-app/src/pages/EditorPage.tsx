import * as React from 'react';
import {
  Drawer,
  DrawerContent,
  GridItem,
  Heading,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { Diagram } from '../components/diagram';
import { Layout } from '../components/layout';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { WorkflowService } from '../services/workflow.service';
import {
  Action,
  ActionInstance,
  ActionLink,
  PropertyValue,
  Workflow,
  WorkflowTrigger,
  WorkflowTriggerInstance,
} from '@nqframework/models';
import { ActionsService } from '../services/actions.service';
import { Toolbox } from '../components/toolbox';
import { Elements, FlowTransform, OnLoadParams } from 'react-flow-renderer';
import { AuthContext, initPromise } from '../firebase/firebase-context';
import { Redirect, useParams } from 'react-router-dom';
import { organizationContext } from '../core/organization-context';
import { ActionProperties } from '../components/action-properties';
import { TriggerService } from '../services/trigger.service';
import { TriggerProperties } from '../components/trigger-properties';

export const EditorPage: React.FC = () => {
  const workflowService = useMemo(() => new WorkflowService(), []);
  const triggerService = useMemo(() => new TriggerService(), []);
  const user = useContext(AuthContext);
  const { organization } = useContext(organizationContext);
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [selectedAction, setSelectedAction] = useState<{
    instance: ActionInstance;
    action: Action;
  } | null>(null);
  const [selectedTrigger, setSelectedTrigger] = useState<{
    trigger: WorkflowTriggerInstance;
    triggerDefinition: WorkflowTrigger;
  } | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: false });

  const [fbInit, setFbInit] = useState(false);

  const { workflowId } = useParams<{ workflowId: string }>();

  const onLoad = useCallback(
    (params: OnLoadParams) => {
      const fromStorage = localStorage.getItem('flowTransform' + workflowId);
      if (fromStorage) {
        const parsed = JSON.parse(fromStorage);
        params.setTransform(parsed);
      }
    },
    [workflowId],
  );

  const addAction = useCallback(
    (action: Action) => {
      workflowService
        .addActionToWorkflow(workflowId, action.id, organization?.name ?? '')
        .then((workflow) => {
          setWorkflow(workflow);
        });
    },
    [workflowService, setWorkflow, workflowId, organization],
  );
  const addTrigger = useCallback(
    (trigger: WorkflowTrigger) => {
      triggerService
        .createTrigger(organization?.name ?? '', workflowId, {
          type: trigger.type,
          editorConfig: {
            color: trigger.color,
            x: 100,
            y: 100,
          },
        } as any)
        .then((workflow) => {
          setWorkflow(workflow);
        });
    },
    [triggerService, setWorkflow, workflowId, organization],
  );
  const updateTrigger = useCallback(
    (trigger: WorkflowTriggerInstance): Promise<void> => {
      return triggerService
        .updateTrigger(
          organization?.name ?? '',
          workflowId,
          trigger.id,
          trigger,
        )
        .then((workflow) => {
          setWorkflow(workflow);
        });
    },
    [triggerService, setWorkflow, workflowId, organization],
  );

  const deleteTrigger = useCallback(
    (triggerId: string): Promise<void> => {
      return triggerService
        .deleteTrigger(organization?.name ?? '', workflowId, triggerId)
        .then((workflow) => {
          setSelectedTrigger(null);
          setWorkflow(workflow);
        });
    },
    [triggerService, setWorkflow, setSelectedTrigger, workflowId, organization],
  );

  const removeAction = useCallback(
    (actionName: string) => {
      workflowService
        .removeActionFromWorkflow(
          workflowId,
          actionName,
          organization?.name ?? '',
        )
        .then((workflow) => {
          setWorkflow(workflow);
        });
    },
    [workflowService, setWorkflow, workflowId, organization],
  );

  const moveEnd = useCallback(
    (transform: FlowTransform | undefined) => {
      localStorage.setItem(
        'flowTransform' + workflowId,
        JSON.stringify(transform),
      );
    },
    [workflowId],
  );

  const addConnection = useCallback(
    (from: string, to: string) => {
      const fromTrigger = workflow?.triggers?.find((t) => t.id === from);
      if (fromTrigger) {
        if (!fromTrigger.actions) {
          fromTrigger.actions = [to];
        } else {
          if (!fromTrigger.actions.includes(to)) {
            fromTrigger.actions.push(to);
          }
        }
        triggerService
          .updateTrigger(
            organization?.name ?? '',
            workflowId,
            from,
            fromTrigger,
          )
          .then((workflow) => {
            setWorkflow(workflow);
          });
        return;
      }
      workflowService
        .linkActionNodes(workflowId, from, to, organization?.name ?? '')
        .then((workflow) => {
          setWorkflow(workflow);
        });
    },
    [
      workflowService,
      triggerService,
      setWorkflow,
      workflowId,
      organization,
      workflow,
    ],
  );

  const [actions, setActions] = useState<Action[]>([]);
  const [triggers, setTriggers] = useState<WorkflowTrigger[]>([]);

  useEffect(() => {
    initPromise.then(() => {
      setFbInit(true);
      if (!user) {
        return;
      }
      workflowService
        .getWorkflow(workflowId, organization?.name ?? '')
        .then((wf) => {
          setWorkflow(wf);
        });
      const actionsService = new ActionsService();
      actionsService.getAll(organization?.name ?? '').then((ac) => {
        setActions(ac);
      });
      triggerService
        .getAllTriggerDefinitions(organization?.name ?? '')
        .then((tg) => {
          setTriggers(tg);
        });
    });
  }, [workflowService, triggerService, user, workflowId, organization]);

  useEffect(() => {
    if (!selectedAction && !selectedTrigger) {
      onClose();
      return;
    }
    onOpen();
  }, [selectedAction, selectedTrigger, onClose, onOpen]);
  const mapAction = useCallback(
    (els: Elements) => {
      if (els.length === 0) {
        setSelectedAction(null);
        setSelectedTrigger(null);
        return;
      }
      const mappedActions = els
        .filter((el) => el.type === 'default')
        .map((el) => workflow?.actionInstances.find((ai) => ai.name === el.id));
      if (mappedActions.length !== 0) {
        const mappedActionInstance = mappedActions[0]!;
        const actionDefinition = actions.find(
          (a) => a.id === mappedActionInstance.action.id,
        );
        if (!actionDefinition) {
          return null;
        }
        setSelectedAction({
          action: actionDefinition,
          instance: mappedActionInstance,
        });
      }
      const mappedTriggers = els
        .filter((el) => el.type !== 'default')
        .map((el) => workflow?.triggers.find((t) => t.id === el.id));
      if (mappedTriggers.length !== 0) {
        const triggerDefinition = triggers.find(
          (t) => t.type === mappedTriggers[0]!.type,
        );
        if (triggerDefinition) {
          setSelectedTrigger({
            trigger: mappedTriggers[0]!,
            triggerDefinition,
          });
        }
      }
    },
    [setSelectedAction, setSelectedTrigger, actions, triggers, workflow],
  );

  const updateActionProperties = useCallback(
    (actionInstanceName: string, propertyValues: PropertyValue[]) => {
      return workflowService.updateActionProperties(
        actionInstanceName,
        propertyValues,
        workflow?.id ?? '',
        organization?.name ?? '',
      );
    },
    [workflowService, organization, workflow],
  );

  const deleteAction = useCallback(
    (action: ActionInstance): Promise<void> => {
      return workflowService
        .removeActionFromWorkflow(
          workflowId,
          action.name,
          organization?.name ?? '',
        )
        .then((wf) => {
          setSelectedAction(null);
          setWorkflow(wf);
        });
    },
    [workflowService, workflowId, organization, setWorkflow, setSelectedAction],
  );
  const deleteLink = useCallback(
    (link: ActionLink): Promise<void> => {
      return workflowService
        .removeActionLinkFromWorkflow(
          workflowId,
          link.fromName,
          link.toName,
          organization?.name ?? '',
        )
        .then((wf) => {
          setWorkflow(wf);
        });
    },
    [workflowService, workflowId, organization, setWorkflow],
  );

  if (!fbInit) {
    return <Heading>Loading...</Heading>;
  }
  return (
    <>
      {!user ? (
        <Redirect to={{ pathname: '/signin' }} />
      ) : (
        <Layout>
          <GridItem padding={6}>
            <Text>Naziv: {workflow?.name ?? ''}</Text>
            <Toolbox
              actions={actions}
              triggers={triggers}
              addAction={addAction}
              addTrigger={addTrigger}
            />
            <Drawer
              isOpen={isOpen}
              placement="left"
              onClose={onClose}
              size="md"
            >
              <DrawerContent background="white">
                <TriggerProperties
                  deleteTrigger={deleteTrigger}
                  updateTrigger={updateTrigger}
                  workflow={workflow}
                  selected={selectedTrigger}
                />
                <ActionProperties
                  deleteAction={deleteAction}
                  deleteLink={deleteLink}
                  workflow={workflow}
                  selected={selectedAction}
                  updateActionProperties={updateActionProperties}
                />
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
