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
  HttpStatus,
  Headers
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
  HistoryPeriodEnum,
  AccountSummaryDto
} from "./dto";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { DevAuthGuard } from "@/common/guards/dev-auth.guard";
import { CurrentUser } from "@/common/decorators/current-user.decorator";
import { Public } from "@/common/decorators/auth.decorator";

@ApiTags('accounts')
@Controller("accounts")
// @UseGuards(DevAuthGuard) // Temporariamente removido para teste
@ApiBearerAuth()
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) { }

  // Endpoints de teste removidos - autenticação agora é obrigatória

  @Get()
  @ApiOperation({ summary: 'Listar todas as contas do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de contas retornada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findAll(
    @Query() filters: AccountFiltersDto
  ) {
    // Temporariamente usar um userId fixo para teste
    const userId = 'test-user-id';
    return this.accountsService.findAll(userId, filters);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Obter resumo das contas do usuário' })
  @ApiResponse({ status: 200, description: 'Resumo das contas retornado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async getSummary(@CurrentUser('id') userId: string): Promise<AccountSummaryDto> {
    return this.accountsService.getSummary(userId);
  }

  @Get('archived')
  @ApiOperation({ summary: 'Listar contas arquivadas do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de contas arquivadas retornada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async getArchived(@CurrentUser('id') userId: string) {
    return this.accountsService.getArchived(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar conta por ID' })
  @ApiParam({ name: 'id', description: 'ID da conta' })
  @ApiResponse({ status: 200, description: 'Conta encontrada com sucesso' })
  @ApiResponse({ status: 404, description: 'Conta não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.accountsService.findOne(id, userId);
  }

  @Post()
  @ApiOperation({ summary: 'Criar nova conta' })
  @ApiResponse({ status: 201, description: 'Conta criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async create(@Body() createAccountDto: CreateAccountDto, @CurrentUser('id') userId: string) {
    console.log('Dados recebidos no controller:', createAccountDto);
    console.log('UserId do token Firebase:', userId);
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
    @CurrentUser('id') userId: string
  ) {
    return this.accountsService.update(id, updateAccountDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar conta' })
  @ApiParam({ name: 'id', description: 'ID da conta' })
  @ApiResponse({ status: 204, description: 'Conta deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Conta não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
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
    @CurrentUser('id') userId: string
  ) {
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
    @CurrentUser('id') userId: string,
    @Query() filters: TransactionFiltersDto
  ) {
    return this.accountsService.getTransactions(id, userId, filters);
  }

  @Post(':id/sync')
  @ApiOperation({ summary: 'Sincronizar conta com banco' })
  @ApiParam({ name: 'id', description: 'ID da conta' })
  @ApiResponse({ status: 200, description: 'Conta sincronizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Conta não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async syncAccount(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.accountsService.syncAccount(id, userId);
  }

  // Endpoint de teste temporário para debug
  @Get(':id/balance-history-test')
  @ApiOperation({ summary: 'TESTE: Obter histórico de saldo da conta (sem autenticação)' })
  async getBalanceHistoryTest(
    @Param('id') id: string,
    @Query() filters: HistoryFiltersDto
  ) {
    console.log(`🔍 TESTE - getBalanceHistoryTest chamado para conta ${id}`);
    console.log(`🔍 TESTE - Filtros:`, filters);

    try {
      // Usar um userId fixo para teste
      const testUserId = 'test-user-id';
      const result = await this.accountsService.getBalanceHistory(id, testUserId, filters);
      console.log(`✅ TESTE - Resultado retornado com sucesso`);
      return result;
    } catch (error) {
      console.error(`❌ TESTE - Erro ao buscar histórico:`, error);
      throw error;
    }
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
    @CurrentUser('id') userId: string,
    @Query() filters: HistoryFiltersDto
  ) {
    console.log(`🔍 CONTROLLER - getBalanceHistory chamado para conta ${id}, usuário ${userId}`);
    console.log(`🔍 CONTROLLER - Filtros:`, filters);

    try {
      const result = await this.accountsService.getBalanceHistory(id, userId, filters);
      console.log(`✅ CONTROLLER - Resultado retornado com sucesso`);
      return result;
    } catch (error) {
      console.error(`❌ CONTROLLER - Erro ao buscar histórico:`, error);
      throw error;
    }
  }

  @Patch(':id/archive')
  @ApiOperation({ summary: 'Arquivar conta' })
  @ApiParam({ name: 'id', description: 'ID da conta' })
  @ApiResponse({ status: 200, description: 'Conta arquivada com sucesso' })
  @ApiResponse({ status: 404, description: 'Conta não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async archive(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.accountsService.archive(id, userId);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restaurar conta arquivada' })
  @ApiParam({ name: 'id', description: 'ID da conta' })
  @ApiResponse({ status: 200, description: 'Conta restaurada com sucesso' })
  @ApiResponse({ status: 404, description: 'Conta arquivada não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async restore(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.accountsService.restore(id, userId);
  }
} 