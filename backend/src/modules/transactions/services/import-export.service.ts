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
                    const validationError = this.validateTransactionRow(row, i + 1);
                    if (validationError) {
                        results.errors.push(validationError);
                        results.errorCount++;
                        continue;
                    }

                    const isDuplicate = await this.checkDuplicateTransaction(row, accountId);
                    if (isDuplicate) {
                        results.duplicateCount++;
                        continue;
                    }

                    const transaction = await this.createTransactionFromRow(row, accountId, userId);
                    results.importedTransactions.push(transaction);
                    results.successCount++;

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
        // Temporariamente desabilitado devido à remoção da dependência xlsx
        throw new Error('Importação Excel temporariamente desabilitada');
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
            transactionCount: transactions.length
        };
    }

    async exportToExcel(userId: string, filters: any, options: ExportTransactionsDto): Promise<ExportResultDto> {
        // Temporariamente desabilitado devido à remoção da dependência xlsx
        throw new Error('Exportação Excel temporariamente desabilitada');
    }

    async exportToPdf(userId: string, filters: any, options: ExportTransactionsDto): Promise<ExportResultDto> {
        // Temporariamente desabilitado
        throw new Error('Exportação PDF temporariamente desabilitada');
    }

    async generateTemplate(format: ExportFormat): Promise<any> {
        return {
            format,
            headers: ['Data', 'Descrição', 'Valor', 'Tipo', 'Status', 'Categoria', 'Conta', 'Observações'],
            sampleData: [
                {
                    Data: '2024-01-15',
                    Descrição: 'Exemplo de transação',
                    Valor: '100.00',
                    Tipo: 'income',
                    Status: 'completed',
                    Categoria: 'Salário',
                    Conta: 'Conta Corrente',
                    Observações: 'Exemplo de observação'
                }
            ],
            instructions: 'Preencha os dados seguindo o formato das colunas. Use vírgula como separador decimal.'
        };
    }

    // Métodos auxiliares
    private async parseCsvFile(file: any): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const results: any[] = [];
            const stream = Readable.from(file.buffer);

            stream
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => resolve(results))
                .on('error', reject);
        });
    }

    private validateTransactionRow(row: any, rowNumber: number): any | null {
        if (!row.Data || !row.Descrição || !row.Valor) {
            return {
                row: rowNumber,
                field: 'required_fields',
                message: 'Campos obrigatórios: Data, Descrição, Valor',
                data: row
            };
        }

        const amount = parseFloat(row.Valor);
        if (isNaN(amount)) {
            return {
                row: rowNumber,
                field: 'valor',
                message: 'Valor deve ser um número válido',
                data: row
            };
        }

        return null;
    }

    private async checkDuplicateTransaction(row: any, accountId: string): Promise<boolean> {
        const existingTransaction = await this.transactionRepository.findOne({
            where: {
                accountId,
                description: row.Descrição,
                amount: parseFloat(row.Valor),
                date: new Date(row.Data)
            }
        });

        return !!existingTransaction;
    }

    private async createTransactionFromRow(row: any, accountId: string, userId: string): Promise<Transaction> {
        const transaction = new Transaction();
        transaction.description = row.Descrição;
        transaction.amount = parseFloat(row.Valor);
        transaction.type = row.Tipo || 'expense';
        transaction.status = row.Status || 'completed';
        transaction.date = new Date(row.Data);
        transaction.accountId = accountId;
        // transaction.userId = userId; // Comentado temporariamente
        transaction.notes = row.Observações || '';

        // Buscar categoria se especificada
        if (row.Categoria) {
            const category = await this.categoryRepository.findOne({
                where: { name: row.Categoria, userId }
            });
            if (category) {
                transaction.categoryId = category.id;
            }
        }

        return await this.transactionRepository.save(transaction);
    }

    private async getTransactionsForExport(userId: string, filters: any): Promise<Transaction[]> {
        const query = this.transactionRepository
            .createQueryBuilder('transaction')
            .leftJoinAndSelect('transaction.account', 'account')
            .leftJoinAndSelect('transaction.category', 'category')
            .where('transaction.userId = :userId', { userId });

        if (filters.startDate) {
            query.andWhere('transaction.date >= :startDate', { startDate: filters.startDate });
        }

        if (filters.endDate) {
            query.andWhere('transaction.date <= :endDate', { endDate: filters.endDate });
        }

        if (filters.accountIds && filters.accountIds.length > 0) {
            query.andWhere('transaction.accountId IN (:...accountIds)', { accountIds: filters.accountIds });
        }

        if (filters.categoryIds && filters.categoryIds.length > 0) {
            query.andWhere('transaction.categoryId IN (:...categoryIds)', { categoryIds: filters.categoryIds });
        }

        return await query.getMany();
    }

    private formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    private async updateAccountBalance(accountId: string, amountChange: number): Promise<void> {
        await this.accountRepository.increment({ id: accountId }, 'balance', amountChange);
    }
}