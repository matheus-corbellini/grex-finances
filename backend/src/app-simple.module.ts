import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AccountsModule } from "@/modules/accounts/accounts.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: "sqlite",
            database: "grex_finances.db",
            autoLoadEntities: true,
            synchronize: true,
            logging: true,
        }),
        AccountsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
