import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionsController } from "./transactions.controller";
import { TransactionsService } from "./transactions.service";
import { Transaction } from "./entities/transaction.entity";
import { TransactionCategory } from "./entities/transaction-category.entity";
import { RecurringTransaction } from "./entities/recurring-transaction.entity";
import { AccountsModule } from "@/modules/accounts/accounts.module";
import { CategoriesModule } from "@/modules/categories/categories.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      TransactionCategory,
      RecurringTransaction,
    ]),
    AccountsModule,
    CategoriesModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
