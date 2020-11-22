import { Module } from '@nestjs/common';
import { ActionService } from './action.service';
import { ActionsController } from './actions.controller';
import { ActionsRepositoryService } from './actions-repository/actions-repository.service';

@Module({
  providers: [ActionService, ActionsRepositoryService],
  exports: [ActionService, ActionsRepositoryService],
  controllers: [ActionsController],
})
export class ActionsModule {}
