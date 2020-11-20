import { ActionInstance } from '@nqframework/models';
import { ActionService } from '../../actions/action.service';
import { getMockExecutionContext } from '../mocks/get-mock-execution-context';
import { executeStack } from "./execute-stack";

const mockExecuteAction = jest.fn();
const mockActionService: ActionService = {
    executeAction: mockExecuteAction
} as any;

describe("executeStack", async () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })
    it("should return without running actions if stack is empty", async () => {
        const context = getMockExecutionContext();
        const result = await executeStack(context, mockActionService);
        expect(mockExecuteAction).not.toHaveBeenCalled();
        expect(result).toEqual({ data: context.actions, finalOutput: context.input });
    })

    it("should execute an action from the top of the stack", async () => {
        mockExecuteAction.mockImplementation((action: ActionInstance) => ({
            propertyValues: [],
            outputValues: [{ name: 'mock output', value: 'mock output value' + action.name }]
        }));
        let context = getMockExecutionContext();
        context.stack.push(context.workflow.actionInstances[0]);
        await executeStack(context, mockActionService);
        expect(mockExecuteAction).toHaveBeenCalledTimes(2);
        expect(mockExecuteAction).toHaveBeenCalledWith(context.workflow.actionInstances[0], context);
        expect(context.actions[context.workflow.actionInstances[0].name]).toBeDefined();
        expect(context.actions[context.workflow.actionInstances[1].name]).toBeDefined();
        expect(context.input['mock output']).toEqual('mock output value' + context.workflow.actionInstances[1].name);
        expect(context.stack).toEqual([]);

        context = getMockExecutionContext();
        context.stack.push(context.workflow.actionInstances[1]);
        await executeStack(context, mockActionService);
        expect(mockExecuteAction).toHaveBeenCalledTimes(3);
        expect(mockExecuteAction).toHaveBeenCalledWith(context.workflow.actionInstances[1], context);
        expect(context.stack).toEqual([]);
    })

    it("should execute only one action if link to other is invalid", async () => {
        mockExecuteAction.mockImplementation(() => ({
            propertyValues: [],
            outputValues: []
        }));
        const context = getMockExecutionContext();
        context.workflow.actionLinks = [{ ...context.workflow.actionLinks[0], toName: 'invalid name' }];
        context.stack.push(context.workflow.actionInstances[0]);
        await executeStack(context, mockActionService);
        expect(mockExecuteAction).toHaveBeenCalledTimes(1);
        expect(mockExecuteAction).toHaveBeenCalledWith(context.workflow.actionInstances[0], context);
        expect(context.stack).toEqual([]);

    })

    it("should execute only one action if no link to other", async () => {
        mockExecuteAction.mockImplementation(() => ({
            propertyValues: [],
            outputValues: []
        }));
        const context = getMockExecutionContext();
        context.workflow.actionLinks = [];
        context.stack.push(context.workflow.actionInstances[0]);
        await executeStack(context, mockActionService);
        expect(mockExecuteAction).toHaveBeenCalledTimes(1);
        expect(mockExecuteAction).toHaveBeenCalledWith(context.workflow.actionInstances[0], context);
        expect(context.stack).toEqual([]);

    })
    it("should execute multiple nodes if more than one link points from node", async () => {
        mockExecuteAction.mockImplementation((action: ActionInstance) => ({
            propertyValues: [],
            outputValues: [{ name: 'mock output', value: 'mock output value' + action.name }]
        }));
        let context = getMockExecutionContext();
        context.stack.push(context.workflow.actionInstances[0]);
        await executeStack(context, mockActionService);
        expect(mockExecuteAction).toHaveBeenCalledTimes(2);
        expect(mockExecuteAction).toHaveBeenCalledWith(context.workflow.actionInstances[0], context);
        expect(context.actions[context.workflow.actionInstances[0].name]).toBeDefined();
        expect(context.actions[context.workflow.actionInstances[1].name]).toBeDefined();
        expect(context.input['mock output']).toEqual('mock output value' + context.workflow.actionInstances[1].name);
        expect(context.stack).toEqual([]);

        context = getMockExecutionContext();
        context.stack.push(context.workflow.actionInstances[1]);
        await executeStack(context, mockActionService);
        expect(mockExecuteAction).toHaveBeenCalledTimes(3);
        expect(mockExecuteAction).toHaveBeenCalledWith(context.workflow.actionInstances[1], context);
        expect(context.stack).toEqual([]);
    })
})