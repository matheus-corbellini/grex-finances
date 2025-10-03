import { Controller, Get, Post, Body, Query, UseGuards, Request } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity, ApiQuery } from "@nestjs/swagger";
import { TransactionsService } from "../transactions/transactions.service";
import { CreateTransactionDto, TransactionFiltersDto, UpdateTransactionDto } from "../transactions/dto";
import { ApiKeyGuard } from "../api-keys/guards/api-key.guard";

@ApiTags('Public API - Transactions')
@Controller("public/transactions")
@UseGuards(ApiKeyGuard)
@ApiSecurity('ApiKey')
export class PublicTransactionsController {
    constructor(private readonly transactionsService: TransactionsService) { }

    @Post()
    @ApiOperation({ summary: 'Criar nova transação via API pública' })
    @ApiResponse({ status: 201, description: 'Transação criada com sucesso' })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    @ApiResponse({ status: 401, description: 'Chave API inválida' })
    async create(@Request() req: any, @Body() createDto: CreateTransactionDto) {
        const userId = req.apiKey.userId;
        return this.transactionsService.create(createDto, userId);
    }

    @Get()
    @ApiOperation({ summary: 'Listar transações via API pública' })
    @ApiResponse({ status: 200, description: 'Lista de transações' })
    @ApiResponse({ status: 401, description: 'Chave API inválida' })
    @ApiQuery({ name: 'contactId', required: false, description: 'Filtrar por contato' })
    @ApiQuery({ name: 'status', required: false, description: 'Filtrar por status' })
    @ApiQuery({ name: 'categoryId', required: false, description: 'Filtrar por categoria' })
    @ApiQuery({ name: 'startDate', required: false, description: 'Data de início (ISO string)' })
    @ApiQuery({ name: 'endDate', required: false, description: 'Data de fim (ISO string)' })
    @ApiQuery({ name: 'externalId', required: false, description: 'Filtrar por ID externo' })
    async findAll(@Request() req: any, @Query() filters?: TransactionFiltersDto) {
        const userId = req.apiKey.userId;
        return this.transactionsService.findAll(userId, filters);
    }

    @Post('upsert')
    @ApiOperation({ summary: 'Criar ou atualizar transação por external_id via API pública' })
    @ApiResponse({ status: 200, description: 'Transação criada ou atualizada com sucesso' })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    @ApiResponse({ status: 401, description: 'Chave API inválida' })
    async upsert(@Request() req: any, @Body() upsertDto: CreateTransactionDto & { externalId: string }) {
        const userId = req.apiKey.userId;
        const { externalId, ...transactionData } = upsertDto;

        // Buscar transação existente por external_id
        const existingTransaction = await this.transactionsService.findByExternalId(userId, externalId);

        if (existingTransaction) {
            return this.transactionsService.update(existingTransaction.id, transactionData as UpdateTransactionDto, userId);
        } else {
            return this.transactionsService.create({ ...transactionData, externalId }, userId);
        }
    }
}
