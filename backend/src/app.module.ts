import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TestController } from "./test.controller";
import { databaseConfig } from "./config/database.config";

// Import essential modules only
import { UsersModule } from "./modules/users/users.module";
import { AccountsModule } from "./modules/accounts/accounts.module";
import { TransactionsModule } from "./modules/transactions/transactions.module";
import { CategoriesModule } from "./modules/categories/categories.module";

// Import common services
import { AppLogger } from "./common/logger/app.logger";
import { GlobalExceptionFilter } from "./common/filters/global-exception.filter";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { MethodLoggingInterceptor } from "./common/interceptors/method-logging.interceptor";

// Temporarily disabled modules with SQLite compatibility issues
// import { BudgetsModule } from "./modules/budgets/budgets.module";
// import { InvestmentsModule } from "./modules/investments/investments.module";
// import { ReportsModule } from "./modules/reports/reports.module";
// import { GoalsModule } from "./modules/goals/goals.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig),
    UsersModule,
    AccountsModule,
    TransactionsModule,
    CategoriesModule,
    // BudgetsModule,
    // InvestmentsModule,
    // ReportsModule,
    // GoalsModule,
  ],
  controllers: [AppController, TestController],
  providers: [
    AppService,
    AppLogger,
    GlobalExceptionFilter,
    LoggingInterceptor,
    MethodLoggingInterceptor,
  ],
  exports: [AppLogger],
})
export class AppModule { }
