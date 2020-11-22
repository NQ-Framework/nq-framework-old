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
  constructor(
    private workflowService: WorkflowRepositoryService,
    private actionsService: ActionsRepositoryService,
  ) { }

  @Get('')
  async GetAll(@Req() req: Request): Promise<Workflow[]> {
    const workflows = await this.workflowService.getWorkflowsForOrganization(
      req.organizationId,
    );
    return workflows;
  }
  @Post('')
  async CreateWorkflow(
    @Req() req: Request,
    @Body('name') name: string,
  ): Promise<Workflow> {
    if (!name || name.length > 30) {
      throw new BadRequestException('Invalid workflow name');
    }
    const workflow = await this.workflowService.createWorkflow(
      req.organizationId,
      name,
    );
    return workflow;
    throw new BadRequestException();
  }

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
    @Body('actionId')
    actionId: string,
  ): Promise<Workflow> {
    const workflows = await this.workflowService.getWorkflowsForOrganization(
      req.organizationId,
    );
    const workflow = workflows.find((w) => w.id === id);
    if (!workflow) {
      throw new NotFoundException();
    }

    const actions = await this.actionsService.getEnabledActions();
    const action = actions.find((a) => a.id === actionId);

    if (!action) {
      throw new BadRequestException('invalid action id');
    }

    //TODO: move to function that validates!!!
    const count = workflow.actionInstances.reduce(
      (count, a) => (count += a.action.id === actionId ? 1 : 0),
      0,
    );
    workflow.actionInstances.push({
      action,
      name: action.name + (count > 0 ? ' ' + count : ''),
      configuration: {
        input: [],
      },
      editorConfig: {
        color: '#FFFFFF',
        x: 100,
        y: 100,
      },
      isEnabled: true,
    });

    await this.workflowService.updateWorkflow(workflow);
    return workflow;
  }

  @Post(':id/action-links')
  async AddActionLinkToWorkflow(
    @Param('id') id: string,
    @Req() req: Request,
    @Body('fromName')
    fromName: string,
    @Body('toName')
    toName: string,
  ): Promise<Workflow> {
    const workflows = await this.workflowService.getWorkflowsForOrganization(
      req.organizationId,
    );
    const workflow = workflows.find((w) => w.id === id);
    if (!workflow) {
      throw new NotFoundException();
    }

    const actionFrom = workflow.actionInstances.find(
      (a) => a.name === fromName,
    );
    const actionTo = workflow.actionInstances.find((a) => a.name === toName);
    if (!actionFrom || !actionTo) {
      throw new BadRequestException('Invalid source or target action');
    }
    if (actionFrom === actionTo) {
      throw new BadRequestException('Cannot connect node to itself');
    }

    const existingLink = workflow.actionLinks.find(
      (al) => al.fromName === fromName && al.toName === toName,
    );
    if (existingLink) {
      throw new BadRequestException('Link already exists');
    }

    //TODO: move to function that validates!!!
    workflow.actionLinks.push({
      fromName,
      toName,
      isEnabled: true,
    });

    await this.workflowService.updateWorkflow(workflow);
    return workflow;
  }

  @Delete(':id/actions/:actionName')
  async RemoveActionFromWorkflow(
    @Param('id') id: string,
    @Req() req: Request,
    @Param('actionName')
    actionName: string,
  ): Promise<Workflow> {
    const workflows = await this.workflowService.getWorkflowsForOrganization(
      req.organizationId,
    );
    const workflow = workflows.find((w) => w.id === id);
    if (!workflow) {
      throw new NotFoundException();
    }

    const action = workflow.actionInstances.find(
      (ai) => ai.name === actionName,
    );

    if (!action) {
      throw new BadRequestException('invalid action name');
    }

    //TODO: move to function that validates!!!
    workflow.actionInstances = workflow.actionInstances.filter(
      (ai) => ai.name !== actionName,
    );

    workflow.actionLinks = workflow.actionLinks.filter(
      (al) => al.fromName !== actionName && al.toName !== actionName,
    );

    await this.workflowService.updateWorkflow(workflow);
    return workflow;
  }
}
