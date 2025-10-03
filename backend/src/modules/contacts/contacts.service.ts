import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Contact } from "./entities/contact.entity";
import { CreateContactDto, UpdateContactDto, ContactFiltersDto } from "./dto/contact.dto";

@Injectable()
export class ContactsService {
    constructor(
        @InjectRepository(Contact)
        private readonly contactRepository: Repository<Contact>,
    ) { }

    async create(userId: string, createDto: CreateContactDto): Promise<Contact> {
        // Verificar se já existe contato com o mesmo externalId
        if (createDto.externalId) {
            const existingContact = await this.contactRepository.findOne({
                where: { userId, externalId: createDto.externalId }
            });

            if (existingContact) {
                throw new BadRequestException("Já existe um contato com este ID externo");
            }
        }

        const contact = this.contactRepository.create({
            userId,
            ...createDto
        });

        return this.contactRepository.save(contact);
    }

    async findAll(userId: string, filters?: ContactFiltersDto): Promise<Contact[]> {
        const query = this.contactRepository.createQueryBuilder("contact")
            .where("contact.userId = :userId", { userId });

        if (filters?.name) {
            query.andWhere("contact.name ILIKE :name", { name: `%${filters.name}%` });
        }

        if (filters?.email) {
            query.andWhere("contact.email ILIKE :email", { email: `%${filters.email}%` });
        }

        if (filters?.phone) {
            query.andWhere("contact.phone ILIKE :phone", { phone: `%${filters.phone}%` });
        }

        if (filters?.document) {
            query.andWhere("contact.document ILIKE :document", { document: `%${filters.document}%` });
        }

        if (filters?.externalId) {
            query.andWhere("contact.externalId = :externalId", { externalId: filters.externalId });
        }

        if (filters?.isActive !== undefined) {
            query.andWhere("contact.isActive = :isActive", { isActive: filters.isActive });
        }

        return query.orderBy("contact.createdAt", "DESC").getMany();
    }

    async findOne(userId: string, id: string): Promise<Contact> {
        const contact = await this.contactRepository.findOne({
            where: { id, userId }
        });

        if (!contact) {
            throw new NotFoundException("Contato não encontrado");
        }

        return contact;
    }

    async findByExternalId(userId: string, externalId: string): Promise<Contact | null> {
        return this.contactRepository.findOne({
            where: { userId, externalId }
        });
    }

    async update(userId: string, id: string, updateDto: UpdateContactDto): Promise<Contact> {
        const contact = await this.findOne(userId, id);

        // Verificar se o novo externalId já existe em outro contato
        if (updateDto.externalId && updateDto.externalId !== contact.externalId) {
            const existingContact = await this.contactRepository.findOne({
                where: { userId, externalId: updateDto.externalId }
            });

            if (existingContact) {
                throw new BadRequestException("Já existe um contato com este ID externo");
            }
        }

        Object.assign(contact, updateDto);
        return this.contactRepository.save(contact);
    }

    async remove(userId: string, id: string): Promise<void> {
        const contact = await this.findOne(userId, id);
        await this.contactRepository.remove(contact);
    }

    async upsertByExternalId(userId: string, externalId: string, data: CreateContactDto): Promise<Contact> {
        const existingContact = await this.findByExternalId(userId, externalId);

        if (existingContact) {
            return this.update(userId, existingContact.id, data);
        } else {
            return this.create(userId, { ...data, externalId });
        }
    }
}
