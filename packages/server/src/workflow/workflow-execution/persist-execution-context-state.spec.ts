import { getMockExecutionContext } from '../mocks/get-mock-execution-context';
import { persistExecutionContextState } from './persist-execution-context-state';
import { getFirebaseApp } from '../../firebase/initialize';

jest.mock('../../firebase/initialize');

describe('persistExecutionContextState', () => {
  it('should store state to db', async () => {
    const mock = getFirebaseApp as jest.Mock;
    let updateDocId: string | undefined = undefined;
    const updateMockFn = jest.fn();

    mock.mockImplementation(() => ({
      firestore: () => ({
        collection: () => ({
          doc(id: string) {
            updateDocId = id;
            return {
              set: updateMockFn,
            };
          },
        }),
      }),
    }));
    const mockContext = getMockExecutionContext();
    await persistExecutionContextState(mockContext);
    expect(updateDocId).toBe(mockContext.id);
    expect(updateMockFn).toHaveBeenCalledWith(mockContext);
  });
});
