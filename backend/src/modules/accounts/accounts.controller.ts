import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery
} from "@nestjs/swagger";
import { AccountsService } from "./accounts.service";
import {
  CreateAccountDto,
  UpdateAccountDto,
  AccountBalanceUpdateDto,
  AccountFiltersDto,
  TransactionFiltersDto,
  HistoryFiltersDto,
  AccountSummaryDto
} from "./dto";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";

@ApiTags('accounts')
@Controller("accounts")
// @UseGuards(JwtAuthGuard) // Temporariamente desabilitado para teste
// @ApiBearerAuth()
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) { }

  @Get()
  @ApiOperation({ summary: 'Listar todas as contas do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de contas retornada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findAll(
    @Request() req: any,
    @Query() filters: AccountFiltersDto
  ) {
    // Mock user para teste
    const userId = '18ceba90-1200-40e5-ac06-de32d18a15a5';
    return this.accountsService.findAll(userId, filters);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Obter resumo das contas do usuário' })
  @ApiResponse({ status: 200, description: 'Resumo das contas retornado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async getSummary(@Request() req: any): Promise<AccountSummaryDto> {
    const userId = req.user.id;
    return this.accountsService.getSummary(userId);
  }

  @Get('archived')
  @ApiOperation({ summary: 'Listar contas arquivadas do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de contas arquivadas retornada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async getArchived(@Request() req: any) {
    const userId = req.user.id;
    return this.accountsService.getArchived(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar conta por ID' })
  @ApiParam({ name: 'id', description: 'ID da conta' })
  @ApiResponse({ status: 200, description: 'Conta encontrada com sucesso' })
  @ApiResponse({ status: 404, description: 'Conta não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.id;
    return this.accountsService.findOne(id, userId);
  }

  @Post()
  @ApiOperation({ summary: 'Criar nova conta' })
  @ApiResponse({ status: 201, description: 'Conta criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async create(@Body() createAccountDto: CreateAccountDto, @Request() req: any) {
    // Mock user para teste
    const userId = '18ceba90-1200-40e5-ac06-de32d18a15a5';
    console.log('Dados recebidos no controller:', createAccountDto);
    console.log('UserId usado:', userId);
    console.log('Tipo de conta recebido:', createAccountDto.type);
    return this.accountsService.create(createAccountDto, userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar conta' })
  @ApiParam({ name: 'id', description: 'ID da conta' })
  @ApiResponse({ status: 200, description: 'Conta atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Conta não encontrada' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async update(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
    @Request() req: any
  ) {
    const userId = req.user.id;
    return this.accountsService.update(id, updateAccountDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar conta' })
  @ApiParam({ name: 'id', description: 'ID da conta' })
  @ApiResponse({ status: 204, description: 'Conta deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Conta não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.id;
    return this.accountsService.remove(id, userId);
  }

  @Patch(':id/balance')
  @ApiOperation({ summary: 'Atualizar saldo da conta' })
  @ApiParam({ name: 'id', description: 'ID da conta' })
  @ApiResponse({ status: 200, description: 'Saldo atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Conta não encontrada' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async updateBalance(
    @Param('id') id: string,
    @Body() balanceData: AccountBalanceUpdateDto,
    @Request() req: any
  ) {
    const userId = req.user.id;
    return this.accountsService.updateBalance(id, balanceData, userId);
  }

  @Get(':id/transactions')
  @ApiOperation({ summary: 'Obter transações da conta' })
  @ApiParam({ name: 'id', description: 'ID da conta' })
  @ApiQuery({ name: 'page', required: false, description: 'Página' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limite por página' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Data de início' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Data de fim' })
  @ApiResponse({ status: 200, description: 'Transações retornadas com sucesso' })
  @ApiResponse({ status: 404, description: 'Conta não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async getTransactions(
    @Param('id') id: string,
    @Request() req: any,
    @Query() filters: TransactionFiltersDto
  ) {
    const userId = req.user.id;
    return this.accountsService.getTransactions(id, userId, filters);
  }

  @Post(':id/sync')
  @ApiOperation({ summary: 'Sincronizar conta com banco' })
  @ApiParam({ name: 'id', description: 'ID da conta' })
  @ApiResponse({ status: 200, description: 'Conta sincronizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Conta não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async syncAccount(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.id;
    return this.accountsService.syncAccount(id, userId);
  }

  @Get(':id/balance-history')
  @ApiOperation({ summary: 'Obter histórico de saldo da conta' })
  @ApiParam({ name: 'id', description: 'ID da conta' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Data de início' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Data de fim' })
  @ApiQuery({ name: 'period', required: false, description: 'Período de agrupamento' })
  @ApiResponse({ status: 200, description: 'Histórico de saldo retornado com sucesso' })
  @ApiResponse({ status: 404, description: 'Conta não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async getBalanceHistory(
    @Param('id') id: string,
    @Request() req: any,
    @Query() filters: HistoryFiltersDto
  ) {
    const userId = req.user.id;
    return this.accountsService.getBalanceHistory(id, userId, filters);
  }

  @Patch(':id/archive')
  @ApiOperation({ summary: 'Arquivar conta' })
  @ApiParam({ name: 'id', description: 'ID da conta' })
  @ApiResponse({ status: 200, description: 'Conta arquivada com sucesso' })
  @ApiResponse({ status: 404, description: 'Conta não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async archive(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.id;
    return this.accountsService.archive(id, userId);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restaurar conta arquivada' })
  @ApiParam({ name: 'id', description: 'ID da conta' })
  @ApiResponse({ status: 200, description: 'Conta restaurada com sucesso' })
  @ApiResponse({ status: 404, description: 'Conta arquivada não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async restore(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.id;
    return this.accountsService.restore(id, userId);
  }
} 