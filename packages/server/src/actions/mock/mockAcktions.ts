import { Action } from '@nqframework/models';

export const mockActions: Action[] = [
    {
        id: '123',
        name: 'mock action',
        hasDefaultPort: true,
        isEnabled: true,
        path: 'mock-path',
        version: 1,
        additionalPorts: [],
        outputFields: [],
        properties: []
    },
    {
        id: '124',
        name: 'mock disabled action',
        hasDefaultPort: true,
        isEnabled: false,
        path: 'mock-path',
        version: 1,
        additionalPorts: [],
        outputFields: [],
        properties: []
    }
]