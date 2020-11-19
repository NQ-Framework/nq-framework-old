import { Controller, Get, NotFoundException, Param, Req } from '@nestjs/common';
import { Workflow } from '@nqframework/models';
import { Request } from 'express';
import { WorkflowService } from './workflow.service';

@Controller('workflow')
export class WorkflowController {
    constructor(private workflowService: WorkflowService) { }
    @Get(':id')
    async GetById(@Param('id') id: string, @Req() req: Request): Promise<Workflow | undefined> {
        const workflows = await this.workflowService.getWorkflowsForOrganization(req.organizationId);
        const workflow = workflows.find(w => w.id === id);
        if (!workflow) {
            throw new NotFoundException();
        }
        return workflow;
    }
}
