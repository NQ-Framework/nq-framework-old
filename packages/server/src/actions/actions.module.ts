import { Module } from '@nestjs/common';
import { ActionService } from './action.service';

@Module({
  providers: [ActionService],
  exports: [ActionService]
})
export class ActionsModule { }
