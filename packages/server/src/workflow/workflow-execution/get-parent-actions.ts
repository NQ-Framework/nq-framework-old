import { ActionInstance, ActionLink, Workflow } from '@nqframework/models';

export function getParentActions(
    workflow: Workflow,
    actionInstance: ActionInstance,
): ActionInstance[] {
    const links = workflow.actionLinks as ActionLink[];
    return links
        .filter((al) => al.toName === actionInstance.name)
        .map((link) =>
            workflow.actionInstances!.find((ai) => ai.name === link.fromName),
        ) as ActionInstance[];
}