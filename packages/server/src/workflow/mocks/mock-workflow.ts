import { Workflow } from '@nqframework/models';

export const mockWorkflow: Workflow = {
    id: 'mock id',
    isActive: true,
    name: 'mock workflow',
    organizationId: 'mock org id',
    actionInstances: [
        {
            name: 'mock action instance id',
            isEnabled: true,
            editorConfig: {
                color: "#000000",
                x: 100,
                y: 100
            },
            configuration: {
                input: [],
            },
            action: {
                id: 'mock action id',
                isEnabled: true,
                name: 'mock action',
                path: 'mock-path',
                version: 1,
                hasDefaultPort: true,
            },
        },
        {
            name: 'mock action instance id 2',
            isEnabled: true,
            editorConfig: {
                color: "#000000",
                x: 100,
                y: 100
            },
            configuration: {
                input: [],
            },
            action: {
                id: 'mock action id',
                isEnabled: true,
                name: 'mock action',
                path: 'mock-path',
                version: 1,
                hasDefaultPort: true,
            },
        },
    ],
    actionLinks: [
        {
            fromName: 'mock action instance id',
            toName: 'mock action instance id 2',
            isEnabled: true,
        },
    ],
    triggers: [],
};