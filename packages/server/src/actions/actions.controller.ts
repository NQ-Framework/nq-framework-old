import { Controller, Get } from '@nestjs/common';
import { Action } from '@nqframework/models';
import { ActionsRepositoryService } from './actions-repository/actions-repository.service';

@Controller('actions')
export class ActionsController {
  constructor(private actions: ActionsRepositoryService) {}

  @Get('')
  async getEnabledActions(): Promise<Action[]> {
    return await this.actions.getEnabledActions();
  }
}
