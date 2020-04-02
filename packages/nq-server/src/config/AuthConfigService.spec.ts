import { Test, TestingModule } from '@nestjs/testing';
import { AuthConfigService } from './AuthConfigService';
import { ConfigService } from '@nestjs/config';

describe('AuthConfigService', () => {
    let service: AuthConfigService;

    const mockConfigService = {
        get: jest.fn()
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthConfigService, { provide: ConfigService, useValue: mockConfigService }],
        }).compile();

        service = module.get<AuthConfigService>(AuthConfigService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('should get settings from config service', () => {
        mockConfigService.get.mockReturnValue("test value");
        expect(service.projectId).toEqual("test value");
        expect(service.privateKey).toEqual("test value");
        expect(service.clientEmail).toEqual("test value");
    });

});
