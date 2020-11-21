import * as React from "react";
import { GridItem, Text } from "@chakra-ui/react";
import { Diagram } from "../components/diagram";
import { Layout } from "../components/layout";
import { useCallback, useEffect, useMemo, useState } from "react";
import { WorkflowService } from "../services/workflow.service";
import { Action, Workflow } from "@nqframework/models";
import { ActionsService } from "../services/actions.service";
import { Toolbox } from "../components/toolbox";

export const EditorPage: React.FC = () => {
  const workflowService = useMemo(() => new WorkflowService(), []);
  const [workflow, setWorkflow] = useState<Workflow | null>(null);

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
      </GridItem>
      <GridItem>
        {workflow ? (
          <Diagram
            removeActionName={removeAction}
            workflow={workflow!}
            addConnection={addConnection}
          />
        ) : (
          <Text>No workflow :(</Text>
        )}
      </GridItem>
    </Layout>
  );
};
