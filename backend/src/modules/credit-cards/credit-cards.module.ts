import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CreditCardsController } from "./credit-cards.controller";
import { CreditCardsService } from "./credit-cards.service";
import { CreditCard } from "./entities/credit-card.entity";
import { Transaction } from "../transactions/entities/transaction.entity";
import { UsersModule } from "../users/users.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([CreditCard, Transaction]),
        UsersModule
    ],
    controllers: [CreditCardsController],
    providers: [CreditCardsService],
    exports: [CreditCardsService],
})
export class CreditCardsModule { }
