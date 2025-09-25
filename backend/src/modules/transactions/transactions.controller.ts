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
  UploadedFile,
  UseInterceptors,
  Res,
  Header
} from "@nestjs/common";
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiConsumes
} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import * as fs from 'fs';
import * as path from 'path';
import { TransactionsService } from "./transactions.service";
import {
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionFiltersDto,
  TransactionSummaryDto,
  BulkUpdateDto,
  BulkDeleteDto,
  ExportTransactionsDto,
  ExportResultDto,
  ImportResultDto
} from "./dto";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";

@ApiTags('transactions')
@Controller("transactions")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  @Get()
  @ApiOperation({ summary: 'Listar transações do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de transações retornada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findAll(
    @Request() req: any,
    @Query() filters: TransactionFiltersDto,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    const userId = req.user.id;
    return this.transactionsService.findAll(userId, filters, { page, limit });
  }

  @Get('summary')
  @ApiOperation({ summary: 'Obter resumo das transações' })
  @ApiResponse({ status: 200, description: 'Resumo das transações retornado com sucesso' })
  async getSummary(
    @Request() req: any,
    @Query() filters: TransactionFiltersDto
  ): Promise<TransactionSummaryDto> {
    const userId = req.user.id;
    return this.transactionsService.getSummary(userId, filters);
  }

  @Get('recent')
  @ApiOperation({ summary: 'Obter transações recentes' })
  @ApiQuery({ name: 'limit', required: false, description: 'Número de transações (padrão: 10)' })
  async getRecent(
    @Request() req: any,
    @Query('limit') limit: number = 10
  ) {
    const userId = req.user.id;
    return this.transactionsService.getRecent(userId, limit);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Obter transações futuras' })
  @ApiQuery({ name: 'days', required: false, description: 'Número de dias (padrão: 7)' })
  async getUpcoming(
    @Request() req: any,
    @Query('days') days: number = 7
  ) {
    const userId = req.user.id;
    return this.transactionsService.getUpcoming(userId, days);
  }

  @Get('recurring')
  @ApiOperation({ summary: 'Listar transações recorrentes' })
  async getRecurring(@Request() req: any) {
    const userId = req.user.id;
    return this.transactionsService.getRecurring(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar transação por ID' })
  @ApiParam({ name: 'id', description: 'ID da transação' })
  @ApiResponse({ status: 200, description: 'Transação encontrada com sucesso' })
  @ApiResponse({ status: 404, description: 'Transação não encontrada' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.id;
    return this.transactionsService.findOne(id, userId);
  }

  @Post()
  @ApiOperation({ summary: 'Criar nova transação' })
  @ApiResponse({ status: 201, description: 'Transação criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() createTransactionDto: CreateTransactionDto, @Request() req: any) {
    const userId = req.user.id;
    return this.transactionsService.create(createTransactionDto, userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar transação' })
  @ApiParam({ name: 'id', description: 'ID da transação' })
  @ApiResponse({ status: 200, description: 'Transação atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Transação não encontrada' })
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @Request() req: any
  ) {
    const userId = req.user.id;
    return this.transactionsService.update(id, updateTransactionDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir transação' })
  @ApiParam({ name: 'id', description: 'ID da transação' })
  @ApiResponse({ status: 200, description: 'Transação excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Transação não encontrada' })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.id;
    return this.transactionsService.remove(id, userId);
  }

  @Post(':id/duplicate')
  @ApiOperation({ summary: 'Duplicar transação' })
  @ApiParam({ name: 'id', description: 'ID da transação' })
  @ApiResponse({ status: 201, description: 'Transação duplicada com sucesso' })
  async duplicate(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.id;
    return this.transactionsService.duplicate(id, userId);
  }

  @Post('bulk/update')
  @ApiOperation({ summary: 'Atualizar múltiplas transações' })
  @ApiResponse({ status: 200, description: 'Transações atualizadas com sucesso' })
  async bulkUpdate(@Body() bulkUpdateDto: BulkUpdateDto, @Request() req: any) {
    const userId = req.user.id;
    return this.transactionsService.bulkUpdate(bulkUpdateDto, userId);
  }

  @Post('bulk/delete')
  @ApiOperation({ summary: 'Excluir múltiplas transações' })
  @ApiResponse({ status: 200, description: 'Transações excluídas com sucesso' })
  async bulkDelete(@Body() bulkDeleteDto: BulkDeleteDto, @Request() req: any) {
    const userId = req.user.id;
    return this.transactionsService.bulkDelete(bulkDeleteDto, userId);
  }

  @Post('import')
  @ApiOperation({ summary: 'Importar transações de arquivo (CSV/Excel)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ status: 200, description: 'Transações importadas com sucesso' })
  async import(
    @UploadedFile() file: any,
    @Body('accountId') accountId: string,
    @Body('options') options: any,
    @Request() req: any
  ): Promise<ImportResultDto> {
    const userId = req.user.id;
    return this.transactionsService.import(file, accountId, userId, options);
  }

  @Get('export/csv')
  @ApiOperation({ summary: 'Exportar transações para CSV' })
  @Header('Content-Type', 'text/csv')
  async exportCsv(
    @Request() req: any,
    @Query() filters: TransactionFiltersDto,
    @Query() options: ExportTransactionsDto,
    @Res() res: Response
  ) {
    const userId = req.user.id;
    const result = await this.transactionsService.exportCsv(userId, filters, options);

    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.setHeader('Content-Type', result.mimeType);
    res.setHeader('Content-Length', result.size.toString());

    res.send(result.content);
  }

  @Get('export/pdf')
  @ApiOperation({ summary: 'Exportar transações para PDF' })
  @Header('Content-Type', 'application/pdf')
  async exportPdf(
    @Request() req: any,
    @Query() filters: TransactionFiltersDto,
    @Query() options: ExportTransactionsDto,
    @Res() res: Response
  ) {
    const userId = req.user.id;
    const result = await this.transactionsService.exportPdf(userId, filters, options);

    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.setHeader('Content-Type', result.mimeType);
    res.setHeader('Content-Length', result.size.toString());

    res.send(result.content);
  }

  @Get('export/excel')
  @ApiOperation({ summary: 'Exportar transações para Excel' })
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  async exportExcel(
    @Request() req: any,
    @Query() filters: TransactionFiltersDto,
    @Query() options: ExportTransactionsDto,
    @Res() res: Response
  ) {
    const userId = req.user.id;
    const result = await this.transactionsService.exportExcel(userId, filters, options);

    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.setHeader('Content-Type', result.mimeType);
    res.setHeader('Content-Length', result.size.toString());

    res.send(result.content);
  }

  @Get('import/template')
  @ApiOperation({ summary: 'Baixar template de importação CSV' })
  @Header('Content-Type', 'text/csv')
  async downloadImportTemplate(@Res() res: Response) {
    const templatePath = path.join(__dirname, 'templates', 'import-template.csv');

    if (!fs.existsSync(templatePath)) {
      res.status(404).json({ message: 'Template não encontrado' });
      return;
    }

    const templateContent = fs.readFileSync(templatePath, 'utf8');

    res.setHeader('Content-Disposition', 'attachment; filename="template-importacao-transacoes.csv"');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Length', Buffer.byteLength(templateContent, 'utf8').toString());

    res.send(templateContent);
  }
}