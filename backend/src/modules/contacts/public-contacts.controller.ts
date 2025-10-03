import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity, ApiQuery } from "@nestjs/swagger";
import { ContactsService } from "./contacts.service";
import { CreateContactDto, UpdateContactDto, ContactFiltersDto } from "./dto/contact.dto";
import { ApiKeyGuard } from "../api-keys/guards/api-key.guard";

@ApiTags('Public API - Contacts')
@Controller("public/contacts")
@UseGuards(ApiKeyGuard)
@ApiSecurity('ApiKey')
export class PublicContactsController {
    constructor(private readonly contactsService: ContactsService) { }

    @Post()
    @ApiOperation({ summary: 'Criar novo contato via API pública' })
    @ApiResponse({ status: 201, description: 'Contato criado com sucesso' })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    @ApiResponse({ status: 401, description: 'Chave API inválida' })
    async create(@Request() req: any, @Body() createDto: CreateContactDto) {
        const userId = req.apiKey.userId;
        return this.contactsService.create(userId, createDto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar contatos via API pública' })
    @ApiResponse({ status: 200, description: 'Lista de contatos' })
    @ApiResponse({ status: 401, description: 'Chave API inválida' })
    @ApiQuery({ name: 'name', required: false, description: 'Filtrar por nome' })
    @ApiQuery({ name: 'email', required: false, description: 'Filtrar por email' })
    @ApiQuery({ name: 'phone', required: false, description: 'Filtrar por telefone' })
    @ApiQuery({ name: 'document', required: false, description: 'Filtrar por CPF/CNPJ' })
    @ApiQuery({ name: 'externalId', required: false, description: 'Filtrar por ID externo' })
    @ApiQuery({ name: 'isActive', required: false, description: 'Filtrar por status ativo' })
    async findAll(@Request() req: any, @Query() filters?: ContactFiltersDto) {
        const userId = req.apiKey.userId;
        return this.contactsService.findAll(userId, filters);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obter contato por ID via API pública' })
    @ApiResponse({ status: 200, description: 'Contato encontrado' })
    @ApiResponse({ status: 404, description: 'Contato não encontrado' })
    @ApiResponse({ status: 401, description: 'Chave API inválida' })
    async findOne(@Request() req: any, @Param('id') id: string) {
        const userId = req.apiKey.userId;
        return this.contactsService.findOne(userId, id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualizar contato via API pública' })
    @ApiResponse({ status: 200, description: 'Contato atualizado com sucesso' })
    @ApiResponse({ status: 404, description: 'Contato não encontrado' })
    @ApiResponse({ status: 401, description: 'Chave API inválida' })
    async update(
        @Request() req: any,
        @Param('id') id: string,
        @Body() updateDto: UpdateContactDto
    ) {
        const userId = req.apiKey.userId;
        return this.contactsService.update(userId, id, updateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remover contato via API pública' })
    @ApiResponse({ status: 200, description: 'Contato removido com sucesso' })
    @ApiResponse({ status: 404, description: 'Contato não encontrado' })
    @ApiResponse({ status: 401, description: 'Chave API inválida' })
    async remove(@Request() req: any, @Param('id') id: string) {
        const userId = req.apiKey.userId;
        await this.contactsService.remove(userId, id);
        return { message: 'Contato removido com sucesso' };
    }

    @Post('upsert')
    @ApiOperation({ summary: 'Criar ou atualizar contato por external_id via API pública' })
    @ApiResponse({ status: 200, description: 'Contato criado ou atualizado com sucesso' })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    @ApiResponse({ status: 401, description: 'Chave API inválida' })
    async upsert(@Request() req: any, @Body() upsertDto: CreateContactDto & { externalId: string }) {
        const userId = req.apiKey.userId;
        const { externalId, ...contactData } = upsertDto;
        return this.contactsService.upsertByExternalId(userId, externalId, contactData);
    }
}
