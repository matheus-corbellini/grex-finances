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
      type: "mysql",
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      username: process.env.DB_USERNAME || "root",
      password: process.env.DB_PASSWORD || "password",
      database: process.env.DB_DATABASE || "grex_finances",
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== "production",
      logging: process.env.NODE_ENV === "development",
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
export class AppModule {}
