import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { Account } from '../../accounts/entities/account.entity';
import { Category } from '../../categories/entities/category.entity';
import {
    ImportTransactionsDto,
    ImportResultDto,
    ExportTransactionsDto,
    ExportResultDto,
    ExportFormat,
    ExportTemplate
} from '../dto';
import csv from 'csv-parser';
import * as XLSX from 'xlsx';
import * as puppeteer from 'puppeteer';
import { Readable } from 'stream';

@Injectable()
export class ImportExportService {
    constructor(
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>,
        @InjectRepository(Account)
        private accountRepository: Repository<Account>,
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) { }

    async importFromCsv(file: any, accountId: string, userId: string, options?: any): Promise<ImportResultDto> {
        const account = await this.accountRepository.findOne({
            where: { id: accountId, userId }
        });

        if (!account) {
            throw new NotFoundException('Conta não encontrada');
        }

        const results: ImportResultDto = {
            totalProcessed: 0,
            successCount: 0,
            errorCount: 0,
            duplicateCount: 0,
            errors: [],
            importedTransactions: []
        };

        try {
            const csvData = await this.parseCsvFile(file);
            results.totalProcessed = csvData.length;

            for (let i = 0; i < csvData.length; i++) {
                const row = csvData[i];

                try {
                    // Validar dados da linha
                    const validationError = this.validateTransactionRow(row, i + 1);
                    if (validationError) {
                        results.errors.push(validationError);
                        results.errorCount++;
                        continue;
                    }

                    // Verificar duplicatas se solicitado
                    if (options?.skipDuplicates) {
                        const isDuplicate = await this.checkDuplicateTransaction(row, accountId);
                        if (isDuplicate) {
                            results.duplicateCount++;
                            continue;
                        }
                    }

                    // Buscar categoria se fornecida
                    let categoryId = null;
                    if (row.category) {
                        const category = await this.categoryRepository.findOne({
                            where: { name: row.category, userId }
                        });
                        categoryId = category?.id;
                    }

                    // Criar transação
                    const transaction = this.transactionRepository.create({
                        description: row.description,
                        amount: parseFloat(row.amount.replace(',', '.')),
                        type: row.type as any,
                        status: (row.status || options?.defaultStatus || 'completed') as any,
                        accountId,
                        categoryId,
                        date: new Date(row.date),
                        notes: row.notes || '',
                        isRecurring: false
                    });

                    const savedTransaction = await this.transactionRepository.save(transaction);
                    results.importedTransactions.push(savedTransaction);
                    results.successCount++;

                    // Atualizar saldo da conta
                    await this.updateAccountBalance(accountId, transaction.amount);

                } catch (error) {
                    results.errors.push({
                        row: i + 1,
                        field: 'general',
                        message: error.message,
                        data: row
                    });
                    results.errorCount++;
                }
            }

            return results;

        } catch (error) {
            throw new BadRequestException(`Erro ao processar arquivo CSV: ${error.message}`);
        }
    }

    async importFromExcel(file: any, accountId: string, userId: string, options?: any): Promise<ImportResultDto> {
        const account = await this.accountRepository.findOne({
            where: { id: accountId, userId }
        });

        if (!account) {
            throw new NotFoundException('Conta não encontrada');
        }

        const results: ImportResultDto = {
            totalProcessed: 0,
            successCount: 0,
            errorCount: 0,
            duplicateCount: 0,
            errors: [],
            importedTransactions: []
        };

        try {
            const workbook = XLSX.read(file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            results.totalProcessed = jsonData.length;

            for (let i = 0; i < jsonData.length; i++) {
                const row = jsonData[i] as any;

                try {
                    // Mapear colunas do Excel para o formato esperado
                    const mappedRow = this.mapExcelRow(row);

                    // Validar dados da linha
                    const validationError = this.validateTransactionRow(mappedRow, i + 1);
                    if (validationError) {
                        results.errors.push(validationError);
                        results.errorCount++;
                        continue;
                    }

                    // Verificar duplicatas se solicitado
                    if (options?.skipDuplicates) {
                        const isDuplicate = await this.checkDuplicateTransaction(mappedRow, accountId);
                        if (isDuplicate) {
                            results.duplicateCount++;
                            continue;
                        }
                    }

                    // Buscar categoria se fornecida
                    let categoryId = null;
                    if (mappedRow.category) {
                        const category = await this.categoryRepository.findOne({
                            where: { name: mappedRow.category, userId }
                        });
                        categoryId = category?.id;
                    }

                    // Criar transação
                    const transaction = this.transactionRepository.create({
                        description: mappedRow.description,
                        amount: parseFloat(mappedRow.amount.toString().replace(',', '.')),
                        type: mappedRow.type as any,
                        status: (mappedRow.status || options?.defaultStatus || 'completed') as any,
                        accountId,
                        categoryId,
                        date: new Date(mappedRow.date),
                        notes: mappedRow.notes || '',
                        isRecurring: false
                    });

                    const savedTransaction = await this.transactionRepository.save(transaction);
                    results.importedTransactions.push(savedTransaction);
                    results.successCount++;

                    // Atualizar saldo da conta
                    await this.updateAccountBalance(accountId, transaction.amount);

                } catch (error) {
                    results.errors.push({
                        row: i + 1,
                        field: 'general',
                        message: error.message,
                        data: row
                    });
                    results.errorCount++;
                }
            }

            return results;

        } catch (error) {
            throw new BadRequestException(`Erro ao processar arquivo Excel: ${error.message}`);
        }
    }

    async exportToCsv(userId: string, filters: any, options: ExportTransactionsDto): Promise<ExportResultDto> {
        const transactions = await this.getTransactionsForExport(userId, filters);

        const csvData = transactions.map(t => ({
            Data: this.formatDate(t.date),
            Descrição: t.description,
            Valor: t.amount,
            Tipo: t.type,
            Status: t.status,
            Categoria: t.category?.name || '',
            Conta: t.account.name,
            Observações: t.notes || ''
        }));

        const headers = Object.keys(csvData[0] || {});
        const csvContent = [
            headers.join(','),
            ...csvData.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
        ].join('\n');

        const filename = options.filename || `transacoes_${new Date().toISOString().split('T')[0]}.csv`;

        return {
            content: csvContent,
            filename,
            mimeType: 'text/csv',
            size: Buffer.byteLength(csvContent, 'utf8'),
            generatedAt: new Date().toISOString(),
            transactionCount: transactions.length,
            summary: options.includeSummary ? await this.generateSummary(transactions) : undefined
        };
    }

    async exportToPdf(userId: string, filters: any, options: ExportTransactionsDto): Promise<ExportResultDto> {
        const transactions = await this.getTransactionsForExport(userId, filters);
        const summary = options.includeSummary ? await this.generateSummary(transactions) : null;

        const html = this.generatePdfHtml(transactions, summary, options.template);

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20mm',
                right: '20mm',
                bottom: '20mm',
                left: '20mm'
            }
        });

        await browser.close();

        const filename = options.filename || `transacoes_${new Date().toISOString().split('T')[0]}.pdf`;

        return {
            content: Buffer.from(pdfBuffer),
            filename,
            mimeType: 'application/pdf',
            size: pdfBuffer.length,
            generatedAt: new Date().toISOString(),
            transactionCount: transactions.length,
            summary
        };
    }

    async exportToExcel(userId: string, filters: any, options: ExportTransactionsDto): Promise<ExportResultDto> {
        const transactions = await this.getTransactionsForExport(userId, filters);

        const excelData = transactions.map(t => ({
            Data: this.formatDate(t.date),
            Descrição: t.description,
            Valor: t.amount,
            Tipo: t.type,
            Status: t.status,
            Categoria: t.category?.name || '',
            Conta: t.account.name,
            Observações: t.notes || ''
        }));

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(excelData);

        // Adicionar resumo se solicitado
        if (options.includeSummary) {
            const summary = await this.generateSummary(transactions);
            const summarySheet = XLSX.utils.json_to_sheet([summary]);
            XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumo');
        }

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Transações');

        const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        const filename = options.filename || `transacoes_${new Date().toISOString().split('T')[0]}.xlsx`;

        return {
            content: excelBuffer,
            filename,
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            size: excelBuffer.length,
            generatedAt: new Date().toISOString(),
            transactionCount: transactions.length,
            summary: options.includeSummary ? await this.generateSummary(transactions) : undefined
        };
    }

    private async parseCsvFile(file: any): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const results: any[] = [];
            const stream = Readable.from(file.buffer);

            stream
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => resolve(results))
                .on('error', (error) => reject(error));
        });
    }

    private mapExcelRow(row: any): any {
        // Mapear diferentes possíveis nomes de colunas
        const mapping = {
            date: ['data', 'date', 'Data', 'Date', 'DATA', 'DATE'],
            description: ['descrição', 'description', 'Descrição', 'Description', 'DESCRIÇÃO', 'DESCRIPTION'],
            amount: ['valor', 'amount', 'Valor', 'Amount', 'VALOR', 'AMOUNT'],
            type: ['tipo', 'type', 'Tipo', 'Type', 'TIPO', 'TYPE'],
            status: ['status', 'Status', 'STATUS'],
            category: ['categoria', 'category', 'Categoria', 'Category', 'CATEGORIA', 'CATEGORY'],
            notes: ['observações', 'notes', 'Observações', 'Notes', 'OBSERVAÇÕES', 'NOTES']
        };

        const mappedRow: any = {};

        Object.keys(mapping).forEach(key => {
            const possibleNames = mapping[key];
            for (const name of possibleNames) {
                if (row[name] !== undefined) {
                    mappedRow[key] = row[name];
                    break;
                }
            }
        });

        return mappedRow;
    }

    private validateTransactionRow(row: any, rowNumber: number): any {
        const errors = [];

        if (!row.date) {
            errors.push({ field: 'date', message: 'Data é obrigatória' });
        } else if (isNaN(Date.parse(row.date))) {
            errors.push({ field: 'date', message: 'Data inválida' });
        }

        if (!row.description) {
            errors.push({ field: 'description', message: 'Descrição é obrigatória' });
        }

        if (!row.amount) {
            errors.push({ field: 'amount', message: 'Valor é obrigatório' });
        } else if (isNaN(parseFloat(row.amount.toString().replace(',', '.')))) {
            errors.push({ field: 'amount', message: 'Valor inválido' });
        }

        if (!row.type) {
            errors.push({ field: 'type', message: 'Tipo é obrigatório' });
        } else if (!['income', 'expense', 'transfer'].includes(row.type.toLowerCase())) {
            errors.push({ field: 'type', message: 'Tipo deve ser: income, expense ou transfer' });
        }

        if (errors.length > 0) {
            return {
                row: rowNumber,
                field: errors[0].field,
                message: errors[0].message,
                data: row
            };
        }

        return null;
    }

    private async checkDuplicateTransaction(row: any, accountId: string): Promise<boolean> {
        const existingTransaction = await this.transactionRepository.findOne({
            where: {
                accountId,
                description: row.description,
                amount: parseFloat(row.amount.toString().replace(',', '.')),
                date: new Date(row.date)
            }
        });

        return !!existingTransaction;
    }

    private async getTransactionsForExport(userId: string, filters: any): Promise<any[]> {
        const query = this.transactionRepository.createQueryBuilder('transaction')
            .leftJoinAndSelect('transaction.category', 'category')
            .leftJoinAndSelect('transaction.account', 'account')
            .where('account.userId = :userId', { userId });

        if (filters.accountId) {
            query.andWhere('transaction.accountId = :accountId', { accountId: filters.accountId });
        }

        if (filters.startDate && filters.endDate) {
            query.andWhere('transaction.date BETWEEN :startDate AND :endDate', {
                startDate: filters.startDate,
                endDate: filters.endDate
            });
        }

        if (filters.type) {
            query.andWhere('transaction.type = :type', { type: filters.type });
        }

        if (filters.status) {
            query.andWhere('transaction.status = :status', { status: filters.status });
        }

        query.orderBy('transaction.date', 'DESC');

        return query.getMany();
    }

    private async generateSummary(transactions: any[]): Promise<any> {
        const summary = transactions.reduce((acc, transaction) => {
            const amount = Math.abs(transaction.amount);

            if (transaction.type === 'income') {
                acc.totalIncome += amount;
                acc.transactionCount.income++;
            } else if (transaction.type === 'expense') {
                acc.totalExpenses += amount;
                acc.transactionCount.expenses++;
            } else if (transaction.type === 'transfer') {
                acc.totalTransfers += amount;
                acc.transactionCount.transfers++;
            }

            acc.transactionCount.total++;
            return acc;
        }, {
            totalIncome: 0,
            totalExpenses: 0,
            totalTransfers: 0,
            netAmount: 0,
            transactionCount: {
                total: 0,
                income: 0,
                expenses: 0,
                transfers: 0
            }
        });

        summary.netAmount = summary.totalIncome - summary.totalExpenses;
        return summary;
    }

    private generatePdfHtml(transactions: any[], summary: any, template: ExportTemplate): string {
        const currentDate = new Date().toLocaleDateString('pt-BR');

        let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Relatório de Transações</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .header h1 { color: #333; margin: 0; }
          .header p { color: #666; margin: 5px 0; }
          .summary { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
          .summary h2 { color: #333; margin-top: 0; }
          .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
          .summary-item { background: white; padding: 15px; border-radius: 6px; text-align: center; }
          .summary-item h3 { margin: 0 0 10px 0; color: #666; font-size: 14px; }
          .summary-item .value { font-size: 24px; font-weight: bold; }
          .income { color: #28a745; }
          .expense { color: #dc3545; }
          .net { color: #007bff; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f8f9fa; font-weight: bold; }
          .amount-income { color: #28a745; }
          .amount-expense { color: #dc3545; }
          .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Relatório de Transações</h1>
          <p>Gerado em: ${currentDate}</p>
          <p>Total de transações: ${transactions.length}</p>
        </div>
    `;

        if (summary) {
            html += `
        <div class="summary">
          <h2>Resumo Financeiro</h2>
          <div class="summary-grid">
            <div class="summary-item">
              <h3>Receitas</h3>
              <div class="value income">R$ ${summary.totalIncome.toFixed(2)}</div>
            </div>
            <div class="summary-item">
              <h3>Despesas</h3>
              <div class="value expense">R$ ${summary.totalExpenses.toFixed(2)}</div>
            </div>
            <div class="summary-item">
              <h3>Saldo Líquido</h3>
              <div class="value net">R$ ${summary.netAmount.toFixed(2)}</div>
            </div>
            <div class="summary-item">
              <h3>Total de Transações</h3>
              <div class="value">${summary.transactionCount.total}</div>
            </div>
          </div>
        </div>
      `;
        }

        html += `
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Tipo</th>
            <th>Status</th>
            <th>Categoria</th>
            <th>Conta</th>
          </tr>
        </thead>
        <tbody>
    `;

        transactions.forEach(transaction => {
            const amountClass = transaction.type === 'income' ? 'amount-income' : 'amount-expense';
            html += `
        <tr>
          <td>${this.formatDate(transaction.date)}</td>
          <td>${transaction.description}</td>
          <td class="${amountClass}">R$ ${transaction.amount.toFixed(2)}</td>
          <td>${transaction.type}</td>
          <td>${transaction.status}</td>
          <td>${transaction.category?.name || '-'}</td>
          <td>${transaction.account.name}</td>
        </tr>
      `;
        });

        html += `
        </tbody>
      </table>
      <div class="footer">
        <p>Relatório gerado automaticamente pelo sistema Grex Finances</p>
      </div>
    </body>
    </html>
    `;

        return html;
    }

    private formatDate(date: Date): string {
        return new Date(date).toLocaleDateString('pt-BR');
    }

    private async updateAccountBalance(accountId: string, amountChange: number): Promise<void> {
        await this.accountRepository.increment({ id: accountId }, 'balance', amountChange);
    }
}
