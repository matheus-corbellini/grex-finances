import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InvestmentsController } from "./investments.controller";
import { InvestmentsService } from "./investments.service";
import { Investment } from "./entities/investment.entity";
import { InvestmentType } from "./entities/investment-type.entity";
import { Portfolio } from "./entities/portfolio.entity";
import { InvestmentTransaction } from "./entities/investment-transaction.entity";
import { AccountsModule } from "../accounts/accounts.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Investment,
      InvestmentType,
      Portfolio,
      InvestmentTransaction,
    ]),
    AccountsModule,
    UsersModule,
  ],
  controllers: [InvestmentsController],
  providers: [InvestmentsService],
  exports: [InvestmentsService],
})
export class InvestmentsModule {}
