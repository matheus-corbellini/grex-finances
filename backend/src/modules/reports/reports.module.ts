import { Module } from "@nestjs/common";
import { ReportsController } from "./reports.controller";
import { ReportsService } from "./reports.service";
import { TransactionsModule } from "../transactions/transactions.module";
import { BudgetsModule } from "../budgets/budgets.module";
import { InvestmentsModule } from "../investments/investments.module";
import { AccountsModule } from "../accounts/accounts.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    TransactionsModule,
    BudgetsModule,
    InvestmentsModule,
    AccountsModule,
    UsersModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
