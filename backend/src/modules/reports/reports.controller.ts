import { Controller, Get, Query, Post, Body } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { ReportsService } from "./reports.service";

@ApiTags('reports')
@Controller("reports")
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get("income-expense-analysis")
  @ApiOperation({ summary: 'Gerar relatório de entradas e saídas' })
  @ApiResponse({ status: 200, description: 'Relatório gerado com sucesso' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Data de início (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Data de fim (ISO string)' })
  @ApiQuery({ name: 'period', required: false, description: 'Período de agrupamento (daily, weekly, monthly)' })
  @ApiQuery({ name: 'regime', required: false, description: 'Regime contábil (cash, accrual)' })
  @ApiQuery({ name: 'considerUnpaid', required: false, description: 'Considerar transações não pagas' })
  async getIncomeExpenseAnalysis(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('period') period?: 'daily' | 'weekly' | 'monthly',
    @Query('regime') regime?: 'cash' | 'accrual',
    @Query('considerUnpaid') considerUnpaid?: boolean
  ) {
    // TODO: Obter userId do token JWT
    const userId = '18ceba90-1200-40e5-ac06-de32d18a15a5'; // Mock user ID

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
  async getCashFlowReport(@Query() filters: any) {
    const userId = '18ceba90-1200-40e5-ac06-de32d18a15a5'; // Mock user ID
    return this.reportsService.getCashFlowReport(userId, filters);
  }

  @Get("category-analysis")
  @ApiOperation({ summary: 'Gerar análise por categorias' })
  async getCategoryAnalysis(@Query() filters: any) {
    const userId = '18ceba90-1200-40e5-ac06-de32d18a15a5'; // Mock user ID
    return this.reportsService.getCategoryAnalysis(userId, filters);
  }

  @Get("bank-account-analysis")
  @ApiOperation({ summary: 'Gerar análise por contas bancárias' })
  async getBankAccountAnalysis(@Query() filters: any) {
    const userId = '18ceba90-1200-40e5-ac06-de32d18a15a5'; // Mock user ID
    return this.reportsService.getBankAccountAnalysis(userId, filters);
  }
} 