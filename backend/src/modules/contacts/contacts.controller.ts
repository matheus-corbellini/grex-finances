import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { ContactsService } from "./contacts.service";
import { CreateContactDto, UpdateContactDto, ContactFiltersDto } from "./dto/contact.dto";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";

@ApiTags('Contacts')
@Controller("contacts")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ContactsController {
    constructor(private readonly contactsService: ContactsService) { }

    @Post()
    @ApiOperation({ summary: 'Criar novo contato' })
    @ApiResponse({ status: 201, description: 'Contato criado com sucesso' })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    async create(@Request() req: any, @Body() createDto: CreateContactDto) {
        const userId = req.user.id;
        return this.contactsService.create(userId, createDto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar contatos do usuário' })
    @ApiResponse({ status: 200, description: 'Lista de contatos' })
    @ApiQuery({ name: 'name', required: false, description: 'Filtrar por nome' })
    @ApiQuery({ name: 'email', required: false, description: 'Filtrar por email' })
    @ApiQuery({ name: 'phone', required: false, description: 'Filtrar por telefone' })
    @ApiQuery({ name: 'document', required: false, description: 'Filtrar por CPF/CNPJ' })
    @ApiQuery({ name: 'externalId', required: false, description: 'Filtrar por ID externo' })
    @ApiQuery({ name: 'isActive', required: false, description: 'Filtrar por status ativo' })
    async findAll(@Request() req: any, @Query() filters?: ContactFiltersDto) {
        const userId = req.user.id;
        return this.contactsService.findAll(userId, filters);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obter contato por ID' })
    @ApiResponse({ status: 200, description: 'Contato encontrado' })
    @ApiResponse({ status: 404, description: 'Contato não encontrado' })
    async findOne(@Request() req: any, @Param('id') id: string) {
        const userId = req.user.id;
        return this.contactsService.findOne(userId, id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualizar contato' })
    @ApiResponse({ status: 200, description: 'Contato atualizado com sucesso' })
    @ApiResponse({ status: 404, description: 'Contato não encontrado' })
    async update(
        @Request() req: any,
        @Param('id') id: string,
        @Body() updateDto: UpdateContactDto
    ) {
        const userId = req.user.id;
        return this.contactsService.update(userId, id, updateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remover contato' })
    @ApiResponse({ status: 200, description: 'Contato removido com sucesso' })
    @ApiResponse({ status: 404, description: 'Contato não encontrado' })
    async remove(@Request() req: any, @Param('id') id: string) {
        const userId = req.user.id;
        await this.contactsService.remove(userId, id);
        return { message: 'Contato removido com sucesso' };
    }
}
