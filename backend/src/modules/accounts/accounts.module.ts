import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccountsController } from "./accounts.controller";
import { AccountsService } from "./accounts.service";
import { Account } from "./entities/account.entity";
import { AccountType } from "./entities/account-type.entity";
import { AccountBalanceHistory } from "./entities/account-balance-history.entity";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([Account, AccountType, AccountBalanceHistory]), UsersModule],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule { }
