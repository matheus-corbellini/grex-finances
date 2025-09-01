import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

// Import all feature modules
import { UsersModule } from "@/modules/users/users.module";
import { AccountsModule } from "@/modules/accounts/accounts.module";
import { TransactionsModule } from "@/modules/transactions/transactions.module";
import { CategoriesModule } from "@/modules/categories/categories.module";
import { BudgetsModule } from "@/modules/budgets/budgets.module";
import { InvestmentsModule } from "@/modules/investments/investments.module";
import { ReportsModule } from "@/modules/reports/reports.module";
import { GoalsModule } from "@/modules/goals/goals.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "grex_finances.db",
      autoLoadEntities: false,
      entities: [],
      synchronize: false,
      logging: false,
    }),
    UsersModule,
    AccountsModule,
    TransactionsModule,
    CategoriesModule,
    BudgetsModule,
    InvestmentsModule,
    ReportsModule,
    GoalsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
