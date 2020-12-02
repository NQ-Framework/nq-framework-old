import { WorkflowExecutionContext } from '@nqframework/models';
import { getFirebaseApp } from '../../firebase/initialize';

export const persistExecutionContextState = async (
  context: WorkflowExecutionContext,
): Promise<void> => {
  const app = await getFirebaseApp();
  await app
    .firestore()
    .collection('workflowExecutionHistory')
    .doc(context.id)
    .set(context);
};
