import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BudgetsController } from "./budgets.controller";
import { BudgetsService } from "./budgets.service";
import { Budget } from "./entities/budget.entity";
import { BudgetCategory } from "./entities/budget-category.entity";
import { BudgetAlert } from "./entities/budget-alert.entity";
import { CategoriesModule } from "@/modules/categories/categories.module";
import { TransactionsModule } from "@/modules/transactions/transactions.module";
import { UsersModule } from "@/modules/users/users.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Budget, BudgetCategory, BudgetAlert]),
    CategoriesModule,
    TransactionsModule,
    UsersModule,
  ],
  controllers: [BudgetsController],
  providers: [BudgetsService],
  exports: [BudgetsService],
})
export class BudgetsModule {}
