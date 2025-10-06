import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BillingController } from "./billing.controller";
import { BillingService } from "./billing.service";
import { Plan } from "./entities/plan.entity";
import { Subscription } from "./entities/subscription.entity";
import { Payment } from "./entities/payment.entity";
import { UsersModule } from "../users/users.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Plan, Subscription, Payment]),
        UsersModule
    ],
    controllers: [BillingController],
    providers: [BillingService],
    exports: [BillingService],
})
export class BillingModule { }
