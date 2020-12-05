import { Injectable } from '@nestjs/common';
import { Workflow, WorkflowTriggerApi } from '@nqframework/models';
import { LoggerService } from '../core/logger.service';
import { getFirebaseApp } from '../firebase/initialize';

@Injectable()
export class WorkflowRepositoryService {
  constructor(private logger: LoggerService) {
    logger.setContext('Workflow Service');
  }

  async getWorkflowsForOrganization(
    organizationId: string,
  ): Promise<Workflow[]> {
    this.logger.debug('Getting workflows for org id ' + organizationId);
    const app = await getFirebaseApp();
    const workflowDocuments = await app
      .firestore()
      .collection('workflows')
      .where('organizationId', '==', organizationId)
      .get();
    return workflowDocuments.docs.map((d) => ({
      ...d.data(),
      id: d.id,
    })) as Workflow[];
  }

  async createWorkflow(
    organizationId: string,
    name: string,
  ): Promise<Workflow> {
    this.logger.debug(
      'Creating new workflow for org id: ' + organizationId + ' name: ' + name,
    );
    const workflow: Workflow = {
      name,
      organizationId,
      actionInstances: [],
      actionLinks: [],
      isActive: false,
      triggers: [],
      endpoints: [],
    } as any;
    const app = await getFirebaseApp();
    const createdDocument = await app
      .firestore()
      .collection('workflows')
      .add(workflow);
    return { ...workflow, id: createdDocument.id } as Workflow;
  }

  async updateWorkflow(workflow: Workflow): Promise<void> {
    const { id, ...restOfWorkflow } = workflow;
    this.logger.debug('Updating workflow id ' + id);
    const app = await getFirebaseApp();
    await app.firestore().doc(`workflows/${id}`).update(restOfWorkflow);
  }

  async getWorkflowsByOrganizationEndpoint(
    organizationId: string,
    endpoint: string,
  ): Promise<Workflow[]> {
    this.logger.debug('Getting workflows for org id ' + organizationId);
    const app = await getFirebaseApp();
    const workflowDocuments = await app
      .firestore()
      .collection('workflows')
      .where('isActive', '==', true)
      .where('organizationId', '==', organizationId)
      .where('endpoints', 'array-contains', endpoint)
      .get();
    return workflowDocuments.docs.map((d) => ({
      ...d.data(),
      id: d.id,
    })) as Workflow[];
  }

  populateWorkflowEndpoints(workflow: Workflow): void {
    workflow.endpoints = workflow.triggers.reduce((prev, cur) => {
      if (cur.type === 'api') {
        const apiTrig = cur as WorkflowTriggerApi;
        if (apiTrig.endpoint) {
          prev.push(apiTrig.endpoint);
        }
      }
      return prev;
    }, [] as string[]);
  }
}
