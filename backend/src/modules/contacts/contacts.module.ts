import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContactsController } from "./contacts.controller";
import { PublicContactsController } from "./public-contacts.controller";
import { ContactsService } from "./contacts.service";
import { Contact } from "./entities/contact.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Contact])],
    controllers: [ContactsController, PublicContactsController],
    providers: [ContactsService],
    exports: [ContactsService],
})
export class ContactsModule { }
