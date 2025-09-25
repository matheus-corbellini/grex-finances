import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { RecurringTransaction, RecurringFrequency, RecurringStatus, CustomFrequencyConfig } from '../entities/recurring-transaction.entity';
import { Transaction, TransactionType, TransactionStatus } from '../entities/transaction.entity';
import { CreateRecurringTransactionDto, UpdateRecurringTransactionDto, ExecuteRecurringTransactionDto, RecurringTransactionFiltersDto } from '../dto/recurring-transaction.dto';

@Injectable()
export class RecurringTransactionsService {
    constructor(
        @InjectRepository(RecurringTransaction)
        private recurringTransactionRepository: Repository<RecurringTransaction>,
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>,
    ) { }

    async create(userId: string, createDto: CreateRecurringTransactionDto): Promise<RecurringTransaction> {
        const recurringTransaction = this.recurringTransactionRepository.create({
            ...createDto,
            userId,
            startDate: new Date(createDto.startDate),
            endDate: createDto.endDate ? new Date(createDto.endDate) : null,
            nextExecutionDate: this.calculateNextExecutionDate(
                new Date(createDto.startDate),
                createDto.frequency,
                createDto.customFrequency
            ),
        });

        return await this.recurringTransactionRepository.save(recurringTransaction);
    }

    async findAll(userId: string, filters?: RecurringTransactionFiltersDto): Promise<RecurringTransaction[]> {
        const query = this.recurringTransactionRepository.createQueryBuilder('rt')
            .leftJoinAndSelect('rt.account', 'account')
            .leftJoinAndSelect('rt.category', 'category')
            .where('rt.userId = :userId', { userId });

        if (filters) {
            if (filters.status) {
                query.andWhere('rt.status = :status', { status: filters.status });
            }
            if (filters.frequency) {
                query.andWhere('rt.frequency = :frequency', { frequency: filters.frequency });
            }
            if (filters.type) {
                query.andWhere('rt.type = :type', { type: filters.type });
            }
            if (filters.accountId) {
                query.andWhere('rt.accountId = :accountId', { accountId: filters.accountId });
            }
            if (filters.categoryId) {
                query.andWhere('rt.categoryId = :categoryId', { categoryId: filters.categoryId });
            }
            if (filters.startDateFrom) {
                query.andWhere('rt.startDate >= :startDateFrom', { startDateFrom: filters.startDateFrom });
            }
            if (filters.startDateTo) {
                query.andWhere('rt.startDate <= :startDateTo', { startDateTo: filters.startDateTo });
            }
            if (filters.activeOnly) {
                query.andWhere('rt.isActive = :isActive', { isActive: true });
            }
        }

        return await query.orderBy('rt.createdAt', 'DESC').getMany();
    }

    async findOne(userId: string, id: string): Promise<RecurringTransaction> {
        const recurringTransaction = await this.recurringTransactionRepository.findOne({
            where: { id, userId },
            relations: ['account', 'category', 'generatedTransactions'],
        });

        if (!recurringTransaction) {
            throw new NotFoundException('Transação recorrente não encontrada');
        }

        return recurringTransaction;
    }

    async update(userId: string, id: string, updateDto: UpdateRecurringTransactionDto): Promise<RecurringTransaction> {
        const recurringTransaction = await this.findOne(userId, id);

        // Se a frequência ou data de início mudaram, recalcular próxima execução
        if (updateDto.frequency || updateDto.startDate || updateDto.customFrequency) {
            const newStartDate = updateDto.startDate ? new Date(updateDto.startDate) : recurringTransaction.startDate;
            const newFrequency = updateDto.frequency || recurringTransaction.frequency;
            const newCustomFrequency = updateDto.customFrequency || recurringTransaction.customFrequency;

            updateDto['nextExecutionDate'] = this.calculateNextExecutionDate(
                newStartDate,
                newFrequency,
                newCustomFrequency
            );
        }

        Object.assign(recurringTransaction, updateDto);
        return await this.recurringTransactionRepository.save(recurringTransaction);
    }

    async remove(userId: string, id: string): Promise<void> {
        const recurringTransaction = await this.findOne(userId, id);
        await this.recurringTransactionRepository.remove(recurringTransaction);
    }

    async pause(userId: string, id: string): Promise<RecurringTransaction> {
        const recurringTransaction = await this.findOne(userId, id);
        recurringTransaction.status = RecurringStatus.PAUSED;
        recurringTransaction.isActive = false;
        return await this.recurringTransactionRepository.save(recurringTransaction);
    }

    async resume(userId: string, id: string): Promise<RecurringTransaction> {
        const recurringTransaction = await this.findOne(userId, id);
        recurringTransaction.status = RecurringStatus.ACTIVE;
        recurringTransaction.isActive = true;
        recurringTransaction.nextExecutionDate = this.calculateNextExecutionDate(
            recurringTransaction.lastExecutedAt || recurringTransaction.startDate,
            recurringTransaction.frequency,
            recurringTransaction.customFrequency
        );
        return await this.recurringTransactionRepository.save(recurringTransaction);
    }

    async execute(userId: string, executeDto: ExecuteRecurringTransactionDto): Promise<Transaction> {
        const recurringTransaction = await this.findOne(userId, executeDto.recurringTransactionId);

        if (!recurringTransaction.isActive || recurringTransaction.status !== RecurringStatus.ACTIVE) {
            throw new BadRequestException('Transação recorrente não está ativa');
        }

        const executionDate = executeDto.executionDate ? new Date(executeDto.executionDate) : new Date();

        // Verificar se já existe transação para esta data (se não for execução forçada)
        if (!executeDto.forceExecution) {
            const existingTransaction = await this.transactionRepository.findOne({
                where: {
                    recurringTransactionId: recurringTransaction.id,
                    date: Between(
                        new Date(executionDate.getFullYear(), executionDate.getMonth(), executionDate.getDate()),
                        new Date(executionDate.getFullYear(), executionDate.getMonth(), executionDate.getDate() + 1)
                    )
                }
            });

            if (existingTransaction) {
                throw new BadRequestException('Já existe uma transação para esta data');
            }
        }

        // Criar nova transação
        const transaction = this.transactionRepository.create({
            accountId: recurringTransaction.accountId,
            categoryId: recurringTransaction.categoryId,
            description: recurringTransaction.description,
            amount: recurringTransaction.amount,
            type: recurringTransaction.type as TransactionType,
            status: TransactionStatus.COMPLETED,
            date: executionDate,
            notes: recurringTransaction.notes,
            isRecurring: true,
            recurringTransactionId: recurringTransaction.id,
        });

        const savedTransaction = await this.transactionRepository.save(transaction);

        // Atualizar transação recorrente
        recurringTransaction.lastExecutedAt = executionDate;
        recurringTransaction.executionCount += 1;
        recurringTransaction.nextExecutionDate = this.calculateNextExecutionDate(
            executionDate,
            recurringTransaction.frequency,
            recurringTransaction.customFrequency
        );

        // Verificar se chegou ao fim
        if (recurringTransaction.endDate && executionDate >= recurringTransaction.endDate) {
            recurringTransaction.status = RecurringStatus.COMPLETED;
            recurringTransaction.isActive = false;
            recurringTransaction.nextExecutionDate = null;
        }

        await this.recurringTransactionRepository.save(recurringTransaction);

        return savedTransaction;
    }

    async executePendingTransactions(): Promise<{ executed: number; errors: string[] }> {
        const now = new Date();
        const errors: string[] = [];
        let executed = 0;

        const pendingTransactions = await this.recurringTransactionRepository.find({
            where: {
                isActive: true,
                status: RecurringStatus.ACTIVE,
                autoExecute: true,
            },
            relations: ['account', 'category'],
        });

        for (const recurringTransaction of pendingTransactions) {
            try {
                // Verificar se deve executar hoje
                if (recurringTransaction.nextExecutionDate &&
                    recurringTransaction.nextExecutionDate <= now &&
                    (!recurringTransaction.endDate || recurringTransaction.nextExecutionDate <= recurringTransaction.endDate)) {

                    await this.execute(recurringTransaction.userId, {
                        recurringTransactionId: recurringTransaction.id,
                        executionDate: recurringTransaction.nextExecutionDate.toISOString(),
                    });

                    executed++;
                }
            } catch (error) {
                errors.push(`Erro ao executar transação recorrente ${recurringTransaction.id}: ${error.message}`);
            }
        }

        return { executed, errors };
    }

    private calculateNextExecutionDate(
        fromDate: Date,
        frequency: RecurringFrequency,
        customFrequency?: CustomFrequencyConfig
    ): Date {
        const nextDate = new Date(fromDate);

        switch (frequency) {
            case RecurringFrequency.DAILY:
                nextDate.setDate(nextDate.getDate() + 1);
                break;

            case RecurringFrequency.WEEKLY:
                nextDate.setDate(nextDate.getDate() + 7);
                break;

            case RecurringFrequency.MONTHLY:
                nextDate.setMonth(nextDate.getMonth() + 1);
                break;

            case RecurringFrequency.QUARTERLY:
                nextDate.setMonth(nextDate.getMonth() + 3);
                break;

            case RecurringFrequency.YEARLY:
                nextDate.setFullYear(nextDate.getFullYear() + 1);
                break;

            case RecurringFrequency.CUSTOM:
                if (!customFrequency) {
                    throw new BadRequestException('Configuração de frequência customizada é obrigatória');
                }
                this.applyCustomFrequency(nextDate, customFrequency);
                break;

            default:
                throw new BadRequestException('Frequência inválida');
        }

        return nextDate;
    }

    private applyCustomFrequency(date: Date, config: CustomFrequencyConfig): void {
        switch (config.type) {
            case 'days':
                date.setDate(date.getDate() + config.interval);
                break;
            case 'weeks':
                date.setDate(date.getDate() + (config.interval * 7));
                break;
            case 'months':
                date.setMonth(date.getMonth() + config.interval);
                break;
            case 'years':
                date.setFullYear(date.getFullYear() + config.interval);
                break;
        }

        // Aplicar restrições específicas
        if (config.daysOfWeek && config.daysOfWeek.length > 0) {
            // Encontrar o próximo dia da semana válido
            while (!config.daysOfWeek.includes(date.getDay())) {
                date.setDate(date.getDate() + 1);
            }
        }

        if (config.daysOfMonth && config.daysOfMonth.length > 0) {
            // Encontrar o próximo dia do mês válido
            while (!config.daysOfMonth.includes(date.getDate())) {
                date.setDate(date.getDate() + 1);
            }
        }

        if (config.monthsOfYear && config.monthsOfYear.length > 0) {
            // Encontrar o próximo mês válido
            while (!config.monthsOfYear.includes(date.getMonth() + 1)) {
                date.setMonth(date.getMonth() + 1);
            }
        }
    }

    async getExecutionHistory(userId: string, id: string): Promise<Transaction[]> {
        await this.findOne(userId, id); // Verificar se existe e pertence ao usuário

        return await this.transactionRepository.find({
            where: { recurringTransactionId: id },
            order: { date: 'DESC' },
            relations: ['account', 'category'],
        });
    }

    async getUpcomingExecutions(userId: string, days: number = 30): Promise<RecurringTransaction[]> {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + days);

        return await this.recurringTransactionRepository.find({
            where: {
                userId,
                isActive: true,
                status: RecurringStatus.ACTIVE,
                nextExecutionDate: Between(new Date(), endDate),
            },
            relations: ['account', 'category'],
            order: { nextExecutionDate: 'ASC' },
        });
    }
}
