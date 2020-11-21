import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { Workflow } from '@nqframework/models';
import { Request } from 'express';
import { ActionsRepositoryService } from '../actions/actions-repository/actions-repository.service';
import { WorkflowRepositoryService } from './workflow-repository.service';

@Controller('workflow')
export class WorkflowController {

  constructor(private workflowService: WorkflowRepositoryService, private actionsService: ActionsRepositoryService) { }

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

  @Post(':id/actions')
  async AddActionToWorkflow(
    @Param('id') id: string,
    @Req() req: Request,
    @Body("actionId")
    actionId: string,
  ) {
    const workflows = await this.workflowService.getWorkflowsForOrganization(
      req.organizationId,
    );
    const workflow = workflows.find((w) => w.id === id);
    if (!workflow) {
      throw new NotFoundException();
    }

    const actions = await this.actionsService.getAll();
    const action = actions.find(a => a.id === actionId);

    if (!action) {
      throw new BadRequestException("invalid action id");
    }

    //TODO: move to function that validates!!!
    const count = workflow.actionInstances.reduce((count, a) => count + a.action.id === actionId ? 1 : 0, 0)
    workflow.actionInstances.push({
      action,
      name: action.name + (count > 0 ? " " + count : ""),
      configuration: {
        input: []
      },
      editorConfig: {
        color: "#000000",
        x: 100,
        y: 100
      },
      isEnabled: true
    })


    await this.workflowService.updateWorkflow(workflow);
  }

  @Delete(':id/actions/:actionName')
  async RemoveActionFromWorkflow(
    @Param('id') id: string,
    @Req() req: Request,
    @Param("actionName")
    actionName: string,
  ) {
    const workflows = await this.workflowService.getWorkflowsForOrganization(
      req.organizationId,
    );
    const workflow = workflows.find((w) => w.id === id);
    if (!workflow) {
      throw new NotFoundException();
    }

    const action = workflow.actionInstances.find(ai => ai.name === actionName);

    if (!action) {
      throw new BadRequestException("invalid action name");
    }

    //TODO: move to function that validates!!!
    workflow.actionInstances = workflow.actionInstances.filter(ai => ai.name !== actionName);

    await this.workflowService.updateWorkflow(workflow);
  }
}
