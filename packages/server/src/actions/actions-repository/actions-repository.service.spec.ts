import { Test, TestingModule } from '@nestjs/testing';
import { ActionsRepositoryService } from './actions-repository.service';
import { getFirebaseApp } from '../../firebase/initialize';
import { mockActions } from '../mock/mockAcktions';

jest.mock('../../firebase/initialize');

describe('ActionsRepositoryService', () => {
  let service: ActionsRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActionsRepositoryService],
    }).compile();

    service = module.get<ActionsRepositoryService>(ActionsRepositoryService);
  });

  it('fetches all actions from firebase', async () => {
    const mockActionsSnapshot = {
      docs: mockActions.map((ma) => {
        const { id, ...rest } = ma;
        return {
          id: id,
          data: () => rest,
        };
      }),
    };

    const mock = getFirebaseApp as jest.Mock;
    mock.mockImplementation(() => ({
      firestore: () => ({
        collection: () => ({
          where: () => ({
            get: () => mockActionsSnapshot,
          }),
        }),
      }),
    }));
    const result = await service.getEnabledActions();
    expect(result).toEqual(mockActions);
    expect(mock).toHaveBeenCalledTimes(1);
  });
});
