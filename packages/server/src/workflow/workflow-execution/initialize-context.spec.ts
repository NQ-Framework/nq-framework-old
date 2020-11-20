import { getMockExecutionContext } from '../mocks/get-mock-execution-context';
import { initializeContext } from "./initialize-context";

describe("initializeContext", () => {
    it('sets links to empty array if undefined', () => {
        const result = initializeContext({ ...getMockExecutionContext(), workflow: { ...getMockExecutionContext().workflow, actionLinks: undefined as any } });
        expect(result.workflow.actionLinks).toBeDefined();
        expect(result.workflow.actionLinks.length).toBe(0);
    });

    it('throw if workflow has no actions', () => {
        expect(() => {
            initializeContext({ ...getMockExecutionContext(), workflow: { ...getMockExecutionContext().workflow, actionInstances: undefined as any } });
        }
        ).toThrowErrorMatchingSnapshot();
    });

    it('removes disabled action links', () => {
        const result = initializeContext({
            ...getMockExecutionContext(),
            workflow: {
                ...getMockExecutionContext().workflow,
                actionLinks: [
                    {
                        ...getMockExecutionContext().workflow.actionLinks[0],
                        isEnabled: false
                    }
                ]
            }
        });
        expect(result.workflow.actionLinks.length).toBe(0);
    });
    it('removes invalid action links', () => {
        const result = initializeContext({
            ...getMockExecutionContext(),
            workflow: {
                ...getMockExecutionContext().workflow,
                actionLinks: [
                    {
                        ...getMockExecutionContext().workflow.actionLinks[0],
                        fromName: 'incorrect name'
                    },
                    {
                        ...getMockExecutionContext().workflow.actionLinks[0],
                        toName: 'incorrect name'
                    },
                    getMockExecutionContext().workflow.actionLinks[0],
                ]
            }
        });
        expect(result.workflow.actionLinks.length).toBe(1);
    });
    it('removes disabled action instances', () => {
        const result = initializeContext({
            ...getMockExecutionContext(),
            workflow: {
                ...getMockExecutionContext().workflow,
                actionInstances: [
                    {
                        ...getMockExecutionContext().workflow.actionInstances[0],
                        isEnabled: false
                    },
                    getMockExecutionContext().workflow.actionInstances[1]
                ]
            }
        });
        expect(result.workflow.actionInstances.length).toBe(1);
    });
})