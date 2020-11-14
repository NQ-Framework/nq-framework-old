import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '../logger/logger.module';
import { HandlerService } from './handler.service';
import { LogJobService } from './log-job/log-job.service';
import { StoredProcedureJobService } from './stored-procedure-job/stored-procedure-job.service';

describe('HandlerService', () => {
  let service: HandlerService;
  const executeJobMock = jest.fn().mockImplementation(() => 'return data');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        HandlerService,
        {
          provide: LogJobService, useValue: {
            ExecuteJob: executeJobMock
          }
        },
        { provide: StoredProcedureJobService, useValue: {} },
      ],
    }).compile();

    service = module.get<HandlerService>(HandlerService);
  });

  it('should fetch handlers', () => {
    expect(service.getHandlerFromConfig({ type: 'log' })).toBeDefined();
    expect(service.getHandlerFromConfig({ type: 'stored-procedure' })).toBeDefined();
    expect(service.getHandlerFromConfig({ type: 'invalid' } as any)).toBeNull();
  });

  it('should execute jobs', async () => {
    const data = await service.executeJob({ configuration: { type: 'log' }, name: 'mock job' } as any);
    expect(executeJobMock).toHaveBeenCalledWith({ type: "log" }, expect.objectContaining({
      name: 'mock job'
    }));
    expect(data).toEqual({ data: 'return data' });
  });

  it('should throw on invalid job configuration', async () => {
    await expect(service.executeJob({ configuration: { type: 'invalid type' }, name: 'mock job' } as any)).rejects.toThrowErrorMatchingSnapshot();
  });
});
