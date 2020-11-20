import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Req,
} from '@nestjs/common';
import { Workflow } from '@nqframework/models';
import { Request } from 'express';
import { WorkflowRepositoryService } from './workflow-repository.service';

@Controller('workflow')
export class WorkflowController {
  constructor(private workflowService: WorkflowRepositoryService) { }
  @Get(':id')
  async GetById(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<Workflow | undefined> {
    const workflows = await this.workflowService.getWorkflowsForOrganization(
      req.organizationId,
    );
    const workflow = workflows.find((w) => w.id === id);
    if (!workflow) {
      throw new NotFoundException();
    }
    return workflow;
  }

  @Patch(':id/positions')
  async PatchNodePositions(
    @Param('id') id: string,
    @Req() req: Request,
    @Body()
    positions: [
      { type: 'trigger' | 'actionInstance'; id: string; x: number; y: number },
    ],
  ) {
    const workflows = await this.workflowService.getWorkflowsForOrganization(
      req.organizationId,
    );
    const workflow = workflows.find((w) => w.id === id);
    if (!workflow) {
      throw new NotFoundException();
    }

    positions.forEach((position) => {
      const node: {
        editorConfig: { x: number; y: number };
      } = (position.type === 'trigger'
        ? workflow.triggers.find((t) => t.id === position.id)
        : workflow.actionInstances.find(
          (ai) => ai.name === position.id,
        )) as any;

      node.editorConfig.x = position.x;
      node.editorConfig.y = position.y;
    });

    await this.workflowService.updateWorkflow(workflow);
  }
}
