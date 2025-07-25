import { Module } from "@nestjs/common";
import { ReportsController } from "./reports.controller";
import { ReportsService } from "./reports.service";
import { TransactionsModule } from "@/modules/transactions/transactions.module";
import { BudgetsModule } from "@/modules/budgets/budgets.module";
import { InvestmentsModule } from "@/modules/investments/investments.module";
import { AccountsModule } from "@/modules/accounts/accounts.module";
import { UsersModule } from "@/modules/users/users.module";

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
