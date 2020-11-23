import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationService } from './organization.service';
import { getFirebaseApp } from "../firebase/initialize";

jest.mock("../firebase/initialize");

describe('OrganizationService', () => {
  let service: OrganizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationService],
    }).compile();

    service = module.get<OrganizationService>(OrganizationService);
  });

  it('should get organizations that the user belongs to', async () => {
    const mock = getFirebaseApp as jest.Mock;
    mock.mockImplementation(() => ({
      firestore: () => ({
        collection: () => ({
          where: (p1: string, p2: string, p3: string) => {
            expect(p1).toEqual("memberIds");
            expect(p2).toEqual("array-contains");
            expect(p3).toEqual("mock id");
            return {
              get: () => ({
                docs: [
                  { data: () => ({ name: 'mock org' }) }
                ]
              })
            }
          }
        })
      })
    }))
    const result = await service.getOrganizationsForUserId("mock id");
    expect(result[0].name).toEqual("mock org");
  });
});
