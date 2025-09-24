import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GoalsController } from "./goals.controller";
import { GoalsService } from "./goals.service";
import { Goal } from "./entities/goal.entity";
import { GoalProgress } from "./entities/goal-progress.entity";
import { UsersModule } from "../users/users.module";
import { AccountsModule } from "../accounts/accounts.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Goal, GoalProgress]),
    UsersModule,
    AccountsModule,
  ],
  controllers: [GoalsController],
  providers: [GoalsService],
  exports: [GoalsService],
})
export class GoalsModule {}
