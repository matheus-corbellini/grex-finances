import { Controller, Get, Query, Post, Body, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from "@nestjs/swagger";
import { ReportsService } from "./reports.service";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { CurrentUser } from "@/common/decorators/current-user.decorator";

@ApiTags('reports')
@Controller("reports")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) { }

  @Get("income-expense-analysis")
  @ApiOperation({ summary: 'Gerar relatório de entradas e saídas' })
  @ApiResponse({ status: 200, description: 'Relatório gerado com sucesso' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Data de início (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Data de fim (ISO string)' })
  @ApiQuery({ name: 'period', required: false, description: 'Período de agrupamento (daily, weekly, monthly)' })
  @ApiQuery({ name: 'regime', required: false, description: 'Regime contábil (cash, accrual)' })
  @ApiQuery({ name: 'considerUnpaid', required: false, description: 'Considerar transações não pagas' })
  async getIncomeExpenseAnalysis(
    @CurrentUser('id') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('period') period?: 'daily' | 'weekly' | 'monthly',
    @Query('regime') regime?: 'cash' | 'accrual',
    @Query('considerUnpaid') considerUnpaid?: boolean
  ) {
    const filters = {
      startDate,
      endDate,
      period,
      regime,
      considerUnpaid: considerUnpaid === true
    };

    return this.reportsService.getIncomeExpenseAnalysis(userId, filters);
  }

  @Get("cash-flow")
  @ApiOperation({ summary: 'Gerar relatório de fluxo de caixa' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Data de início (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Data de fim (ISO string)' })
  @ApiQuery({ name: 'period', required: false, enum: ['daily', 'weekly', 'monthly'], description: 'Período de agrupamento' })
  @ApiQuery({ name: 'regime', required: false, enum: ['cash', 'accrual'], description: 'Regime contábil' })
  @ApiQuery({ name: 'considerUnpaid', required: false, type: Boolean, description: 'Considerar transações não pagas' })
  async getCashFlowReport(
    @CurrentUser('id') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('period') period?: 'daily' | 'weekly' | 'monthly',
    @Query('regime') regime?: 'cash' | 'accrual',
    @Query('considerUnpaid') considerUnpaid?: boolean
  ) {
    const filters = { startDate, endDate, period, regime, considerUnpaid };
    return this.reportsService.getCashFlowReport(userId, filters);
  }

  @Get("category-analysis")
  @ApiOperation({ summary: 'Gerar análise por categorias' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Data de início (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Data de fim (ISO string)' })
  @ApiQuery({ name: 'period', required: false, enum: ['daily', 'weekly', 'monthly'], description: 'Período de agrupamento' })
  @ApiQuery({ name: 'regime', required: false, enum: ['cash', 'accrual'], description: 'Regime contábil' })
  @ApiQuery({ name: 'considerUnpaid', required: false, type: Boolean, description: 'Considerar transações não pagas' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'ID da categoria específica' })
  @ApiQuery({ name: 'accountId', required: false, description: 'ID da conta específica' })
  async getCategoryAnalysis(
    @CurrentUser('id') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('period') period?: 'daily' | 'weekly' | 'monthly',
    @Query('regime') regime?: 'cash' | 'accrual',
    @Query('considerUnpaid') considerUnpaid?: boolean,
    @Query('categoryId') categoryId?: string,
    @Query('accountId') accountId?: string
  ) {
    const filters = { startDate, endDate, period, regime, considerUnpaid, categoryId, accountId };
    return this.reportsService.getCategoryAnalysis(userId, filters);
  }

  @Get("bank-account-analysis")
  @ApiOperation({ summary: 'Gerar análise por contas bancárias' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Data de início (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Data de fim (ISO string)' })
  @ApiQuery({ name: 'period', required: false, enum: ['daily', 'weekly', 'monthly'], description: 'Período de agrupamento' })
  @ApiQuery({ name: 'regime', required: false, enum: ['cash', 'accrual'], description: 'Regime contábil' })
  @ApiQuery({ name: 'considerUnpaid', required: false, type: Boolean, description: 'Considerar transações não pagas' })
  async getBankAccountAnalysis(
    @CurrentUser('id') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('period') period?: 'daily' | 'weekly' | 'monthly',
    @Query('regime') regime?: 'cash' | 'accrual',
    @Query('considerUnpaid') considerUnpaid?: boolean
  ) {
    const filters = { startDate, endDate, period, regime, considerUnpaid };
    return this.reportsService.getBankAccountAnalysis(userId, filters);
  }

  @Get("income-statement")
  @ApiOperation({ summary: 'Gerar DRE Gerencial' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Data de início (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Data de fim (ISO string)' })
  @ApiQuery({ name: 'period', required: false, enum: ['daily', 'weekly', 'monthly'], description: 'Período de agrupamento' })
  @ApiQuery({ name: 'regime', required: false, enum: ['cash', 'accrual'], description: 'Regime contábil' })
  @ApiQuery({ name: 'considerUnpaid', required: false, type: Boolean, description: 'Considerar transações não pagas' })
  async getIncomeStatement(
    @CurrentUser('id') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('period') period?: 'daily' | 'weekly' | 'monthly',
    @Query('regime') regime?: 'cash' | 'accrual',
    @Query('considerUnpaid') considerUnpaid?: boolean
  ) {
    const filters = { startDate, endDate, period, regime, considerUnpaid };
    return this.reportsService.getIncomeStatement(userId, filters);
  }

  // Endpoint de relatório customizado - aguardando implementação no service
  // @Post("custom")
  // @ApiOperation({ summary: 'Gerar relatório customizado' })
  // @ApiResponse({ status: 200, description: 'Relatório gerado com sucesso' })
  // async getCustomReport(@CurrentUser('id') userId: string, @Body() config: any) {
  //   return this.reportsService.getCustomReport(userId, config);
  // }
}
