import { Injectable } from '@nestjs/common';
import { Workflow } from '@nqframework/models';
import { LoggerService } from '../core/logger.service';
import { getFirebaseApp } from '../firebase/initialize';

@Injectable()
export class WorkflowService {
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
}
