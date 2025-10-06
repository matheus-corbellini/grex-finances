import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { ScheduleModule } from '@nestjs/schedule';
import { TransactionsController } from './transactions.controller';
import { PublicTransactionsController } from './public-transactions.controller';
import { RecurringTransactionsController } from './recurring-transactions.controller';
import { TransactionsService } from './transactions.service';
import { RecurringTransactionsService } from './services/recurring-transactions.service';
import { ImportExportService } from './services/import-export.service';
import { RecurringTransactionsTask } from './tasks/recurring-transactions.task';
import { Transaction } from './entities/transaction.entity';
import { RecurringTransaction } from './entities/recurring-transaction.entity';
import { Category } from '../categories/entities/category.entity';
import { Account } from '../accounts/entities/account.entity';
import { ApiKeysModule } from '../api-keys/api-keys.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, RecurringTransaction, Category, Account]),
    ApiKeysModule,
    // ScheduleModule.forRoot()
  ],
  controllers: [TransactionsController, PublicTransactionsController, RecurringTransactionsController],
  providers: [
    TransactionsService,
    RecurringTransactionsService,
    ImportExportService,
    // RecurringTransactionsTask
  ],
  exports: [
    TransactionsService,
    RecurringTransactionsService,
    ImportExportService
  ]
})
export class TransactionsModule { }