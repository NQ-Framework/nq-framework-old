import {
  ActionInstance,
  Workflow,
  WorkflowExecutionContext,
} from '@nqframework/models';

export function loadFollowingActionsInChain(
  workflow: Workflow,
  actionInstance: ActionInstance,
  context: WorkflowExecutionContext,
) {
  if (!workflow.actionLinks || workflow.actionLinks.length === 0) {
    return;
  }

  const nextActions = workflow.actionLinks
    .filter((al) => al.fromName === actionInstance.name)
    .map((al) => workflow.actionInstances.find((ai) => ai.name === al.toName));
  nextActions.forEach((nextAction) => {
    if (nextAction !== undefined) {
      context.stack.push(nextAction);
    }
  });
}
