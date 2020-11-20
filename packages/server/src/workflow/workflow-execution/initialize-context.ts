import { WorkflowExecutionContext } from '@nqframework/models';

export function initializeContext(
  context: WorkflowExecutionContext,
): WorkflowExecutionContext {
  const workflow = context.workflow;
  const actionInstances = workflow.actionInstances
    ? workflow.actionInstances.filter((ai) => ai.isEnabled)
    : [];

  if (actionInstances.length === 0) {
    throw new Error(
      'Execution context cannot be initialized with zero actions',
    );
  }

  let actionLinks = workflow.actionLinks;
  if (!actionLinks) {
    actionLinks = [];
  } else {
    actionLinks = actionLinks.filter((al) =>
      al.isEnabled &&
      actionInstances.some((ai) => ai.name === al.fromName) &&
      actionInstances.some((ai) => ai.name === al.toName)
    );
  }
  return {
    ...context,
    workflow: { ...workflow, actionInstances, actionLinks },
  };
}
