import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReportsController } from "./reports.controller";
import { ReportsService } from "./reports.service";
import { Transaction } from "../transactions/entities/transaction.entity";
import { Account } from "../accounts/entities/account.entity";
import { Category } from "../categories/entities/category.entity";
import { CreditCard } from "../credit-cards/entities/credit-card.entity";
import { Contact } from "../contacts/entities/contact.entity";
import { TransactionsModule } from "../transactions/transactions.module";
import { BudgetsModule } from "../budgets/budgets.module";
import { InvestmentsModule } from "../investments/investments.module";
import { AccountsModule } from "../accounts/accounts.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Account, Category, CreditCard, Contact]),
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
export class ReportsModule { }
