import { OrganizationMiddleware } from "./organization.middleware";
import { getOrganizationIdFromDomain } from "./get-organization-id-from-domain"
jest.mock('./get-organization-id-from-domain');
const mockGetOrg = getOrganizationIdFromDomain as jest.Mock;
mockGetOrg.mockImplementation(() => ('test org id'));

let orgMiddleware: OrganizationMiddleware;
describe('Organization Middleware', () => {

    beforeEach(() => {
        orgMiddleware = new OrganizationMiddleware();
        mockGetOrg.mockClear();
    })
    it('instantiates', () => {
        expect(orgMiddleware).toBeDefined();
    })

    it('extracts org id from domain if present', () => {
        const nextMock = jest.fn();
        const request = {
            subdomains: ['test', 'server'],
            query: {},
            organizationId: '',
            dataSource: ''
        };
        orgMiddleware.use(request as any, {}, nextMock);
        expect(mockGetOrg).toHaveBeenCalledWith('test');
        expect(request.organizationId).toEqual('test org id');
        expect(nextMock).toHaveBeenCalledTimes(1);
    })

    it('extracts org id from query param if present', () => {
        const nextMock = jest.fn();
        const request = {
            subdomains: [],
            query: { organizationId: 'test' },
            organizationId: '',
            dataSource: ''
        };
        orgMiddleware.use(request as any, {}, nextMock);
        expect(mockGetOrg).toHaveBeenCalledWith('test');
        expect(request.organizationId).toEqual('test org id');
        expect(nextMock).toHaveBeenCalledTimes(1);
    })

    it('extracts the data source from from query param if present', () => {
        const nextMock = jest.fn();
        const request = {
            subdomains: [],
            query: { dataSource: 'test' },
            organizationId: '',
            dataSource: ''
        };
        orgMiddleware.use(request as any, {}, nextMock);
        expect(mockGetOrg).not.toHaveBeenCalled();
        expect(request.dataSource).toEqual('test');
        expect(nextMock).toHaveBeenCalledTimes(1);
    })

    it('does nothing when called without subdomain or query params', () => {
        const nextMock = jest.fn();
        const request = {
            subdomains: [],
            query: {},
            organizationId: '',
            dataSource: ''
        };
        orgMiddleware.use(request as any, {}, nextMock);
        expect(mockGetOrg).not.toHaveBeenCalled();
        expect(request.dataSource).toEqual('');
        expect(request.organizationId).toEqual('');
        expect(nextMock).toHaveBeenCalledTimes(1);
    })
});