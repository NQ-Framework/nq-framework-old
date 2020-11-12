import { getFirebaseJobsObservable } from './get-firebase-jobs-observable';
import { getFirebaseApp } from "../../firebase/initialize";

jest.mock('../../firebase/initialize');
const fbMock = getFirebaseApp as jest.Mock;

describe('Get Firebase Jobs Observable', () => {
  it.only('returns an observable', (done) => {
    fbMock.mockImplementation(() => {
      return Promise.resolve({
        firestore: () => ({
          collection: () => ({
            onSnapshot: (cb: Function) => {
              cb({
                docChanges: () => ([
                  {
                    doc: {
                      data: () => ({
                        active: true,
                      }),
                    },
                    type: "added"
                  },
                  {
                    doc: {
                      data: () => ({
                        active: true,
                      }),
                    },
                    type: "removed"
                  },
                ])
              });
              cb({
                docChanges: () => ([
                  {
                    doc: {
                      data: () => ({
                        active: true,
                      }),
                    },
                    type: "added"
                  },
                  {
                    doc: {
                      data: () => ({
                        active: false,
                      }),
                    },
                    type: "modified"
                  },
                ])
              });
            }
          })
        })
      });
    })
    const observable = getFirebaseJobsObservable();
    let index = 0;
    const expectedData = [
      [{ active: true }, { active: false }],
      [{ active: true }, { active: false }],
    ]
    observable.subscribe((data) => {
      expect(data).toEqual(expectedData[index]);
      index++;
      if (index === 2) {
        done();
      }
    });
  });
});
