import { Controller, NotFoundException, Param, Post, Req } from '@nestjs/common';
import { TriggeredJob } from '@nqframework/models';
import { Request } from "express"
import { HandlerService } from '../../job-handler/handler.service';
import { LoggerService } from '../../logger/logger.service';
import { JobsService } from '../jobs/jobs.service';

@Controller('trigger')
export class TriggerController {

    constructor(private logger: LoggerService, private jobs: JobsService, private handler: HandlerService) {
        this.logger.setContext('Trigger Job');
    }
    @Post(':id')
    async documents(@Req() req: Request, @Param('id') jobId: string): Promise<{ data: any }> {
        try {
            const job = await this.jobs.findJob(jobId);
            const data = await this.handler.executeJob(job);
            return data;
        }
        catch (error) {
            this.logger.warn('Error executing job: ' + jobId + ' Message: ' + error.message);
            throw new NotFoundException(error);
        }
    }
}
