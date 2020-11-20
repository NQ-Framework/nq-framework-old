import { Controller, Get } from '@nestjs/common';
import { Action } from '@nqframework/models';
import { ActionsRepositoryService } from './actions-repository/actions-repository.service';

@Controller('actions')
export class ActionsController {
  constructor(private actions: ActionsRepositoryService) {}

  @Get('')
  async getAll(): Promise<Action[]> {
    return await this.actions.getAll();
  }
}
