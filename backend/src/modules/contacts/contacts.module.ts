import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContactsController } from "./contacts.controller";
import { PublicContactsController } from "./public-contacts.controller";
import { ContactsService } from "./contacts.service";
import { Contact } from "./entities/contact.entity";
import { ApiKeysModule } from "../api-keys/api-keys.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Contact]),
        ApiKeysModule
    ],
    controllers: [ContactsController, PublicContactsController],
    providers: [ContactsService],
    exports: [ContactsService],
})
export class ContactsModule { }
