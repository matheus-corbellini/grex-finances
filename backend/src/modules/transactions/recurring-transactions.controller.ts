import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RecurringTransactionsService } from './services/recurring-transactions.service';
import { CreateRecurringTransactionDto, UpdateRecurringTransactionDto, ExecuteRecurringTransactionDto, RecurringTransactionFiltersDto } from './dto/recurring-transaction.dto';
import { RecurringTransaction } from './entities/recurring-transaction.entity';
import { Transaction } from './entities/transaction.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Recurring Transactions')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard) // Temporariamente desabilitado para teste
@Controller('recurring-transactions')
export class RecurringTransactionsController {
    constructor(private readonly recurringTransactionsService: RecurringTransactionsService) { }

    @Get('test')
    @ApiOperation({ summary: 'Teste de endpoint' })
    async test(): Promise<{ message: string }> {
        return { message: 'Endpoint de transações recorrentes funcionando!' };
    }

    @Post()
    @ApiOperation({ summary: 'Criar nova transação recorrente' })
    @ApiResponse({ status: 201, description: 'Transação recorrente criada com sucesso', type: RecurringTransaction })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    async create(@Request() req, @Body() createRecurringTransactionDto: CreateRecurringTransactionDto): Promise<RecurringTransaction> {
        return await this.recurringTransactionsService.create(req.user.id, createRecurringTransactionDto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todas as transações recorrentes do usuário' })
    @ApiResponse({ status: 200, description: 'Lista de transações recorrentes', type: [RecurringTransaction] })
    async findAll(@Request() req, @Query() filters?: RecurringTransactionFiltersDto): Promise<RecurringTransaction[]> {
        return await this.recurringTransactionsService.findAll(req.user.id, filters);
    }

    @Get('upcoming')
    @ApiOperation({ summary: 'Listar próximas execuções de transações recorrentes' })
    @ApiQuery({ name: 'days', required: false, description: 'Número de dias para buscar (padrão: 30)' })
    @ApiResponse({ status: 200, description: 'Lista de próximas execuções', type: [RecurringTransaction] })
    async getUpcoming(@Request() req, @Query('days') days?: number): Promise<RecurringTransaction[]> {
        return await this.recurringTransactionsService.getUpcomingExecutions(req.user.id, days || 30);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar transação recorrente por ID' })
    @ApiResponse({ status: 200, description: 'Transação recorrente encontrada', type: RecurringTransaction })
    @ApiResponse({ status: 404, description: 'Transação recorrente não encontrada' })
    async findOne(@Request() req, @Param('id') id: string): Promise<RecurringTransaction> {
        return await this.recurringTransactionsService.findOne(req.user.id, id);
    }

    @Get(':id/history')
    @ApiOperation({ summary: 'Buscar histórico de execuções de uma transação recorrente' })
    @ApiResponse({ status: 200, description: 'Histórico de execuções', type: [Transaction] })
    @ApiResponse({ status: 404, description: 'Transação recorrente não encontrada' })
    async getExecutionHistory(@Request() req, @Param('id') id: string): Promise<Transaction[]> {
        return await this.recurringTransactionsService.getExecutionHistory(req.user.id, id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Atualizar transação recorrente' })
    @ApiResponse({ status: 200, description: 'Transação recorrente atualizada com sucesso', type: RecurringTransaction })
    @ApiResponse({ status: 404, description: 'Transação recorrente não encontrada' })
    async update(
        @Request() req,
        @Param('id') id: string,
        @Body() updateRecurringTransactionDto: UpdateRecurringTransactionDto
    ): Promise<RecurringTransaction> {
        return await this.recurringTransactionsService.update(req.user.id, id, updateRecurringTransactionDto);
    }

    @Post(':id/pause')
    @ApiOperation({ summary: 'Pausar transação recorrente' })
    @ApiResponse({ status: 200, description: 'Transação recorrente pausada com sucesso', type: RecurringTransaction })
    @ApiResponse({ status: 404, description: 'Transação recorrente não encontrada' })
    async pause(@Request() req, @Param('id') id: string): Promise<RecurringTransaction> {
        return await this.recurringTransactionsService.pause(req.user.id, id);
    }

    @Post(':id/resume')
    @ApiOperation({ summary: 'Retomar transação recorrente' })
    @ApiResponse({ status: 200, description: 'Transação recorrente retomada com sucesso', type: RecurringTransaction })
    @ApiResponse({ status: 404, description: 'Transação recorrente não encontrada' })
    async resume(@Request() req, @Param('id') id: string): Promise<RecurringTransaction> {
        return await this.recurringTransactionsService.resume(req.user.id, id);
    }

    @Post(':id/execute')
    @ApiOperation({ summary: 'Executar transação recorrente manualmente' })
    @ApiResponse({ status: 201, description: 'Transação executada com sucesso', type: Transaction })
    @ApiResponse({ status: 400, description: 'Erro na execução da transação' })
    @ApiResponse({ status: 404, description: 'Transação recorrente não encontrada' })
    async execute(
        @Request() req,
        @Param('id') id: string,
        @Body() executeDto: ExecuteRecurringTransactionDto
    ): Promise<Transaction> {
        executeDto.recurringTransactionId = id;
        return await this.recurringTransactionsService.execute(req.user.id, executeDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Excluir transação recorrente' })
    @ApiResponse({ status: 200, description: 'Transação recorrente excluída com sucesso' })
    @ApiResponse({ status: 404, description: 'Transação recorrente não encontrada' })
    async remove(@Request() req, @Param('id') id: string): Promise<void> {
        return await this.recurringTransactionsService.remove(req.user.id, id);
    }
}
