import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between, Like, In, MoreThanOrEqual } from "typeorm";
import { Transaction } from "./entities/transaction.entity";
import { Category } from "../categories/entities/category.entity";
import { Account } from "../accounts/entities/account.entity";
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
import { ImportExportService } from "./services/import-export.service";

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    public transactionRepository: Repository<Transaction>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    // private importExportService: ImportExportService, // Temporariamente comentado
  ) { }

  async findAll(
    userId: string,
    filters?: TransactionFiltersDto,
    pagination?: { page: number; limit: number }
  ) {
    const query = this.transactionRepository.createQueryBuilder('transaction')
      .leftJoin('transaction.category', 'category')
      .leftJoin('transaction.account', 'account')
      .addSelect(['category.id', 'category.name', 'category.type', 'category.icon', 'category.color'])
      .addSelect(['account.id', 'account.name', 'account.balance', 'account.typeId'])
      // .leftJoinAndSelect('transaction.recurringTransaction', 'recurring') // Comentado temporariamente
      .where('account.userId = :userId', { userId });

    if (filters) {
      if (filters.accountId) {
        query.andWhere('transaction.accountId = :accountId', { accountId: filters.accountId });
      }
      if (filters.categoryId) {
        query.andWhere('transaction.categoryId = :categoryId', { categoryId: filters.categoryId });
      }
      if (filters.type) {
        query.andWhere('transaction.type = :type', { type: filters.type });
      }
      if (filters.status) {
        query.andWhere('transaction.status = :status', { status: filters.status });
      }
      if (filters.startDate && filters.endDate) {
        query.andWhere('transaction.date BETWEEN :startDate AND :endDate', {
          startDate: filters.startDate,
          endDate: filters.endDate
        });
      }
      if (filters.minAmount !== undefined) {
        query.andWhere('ABS(transaction.amount) >= :minAmount', { minAmount: filters.minAmount });
      }
      if (filters.maxAmount !== undefined) {
        query.andWhere('ABS(transaction.amount) <= :maxAmount', { maxAmount: filters.maxAmount });
      }
      if (filters.search) {
        query.andWhere('transaction.description LIKE :search', { search: `%${filters.search}%` });
      }
      if (filters.isRecurring !== undefined) {
        query.andWhere('transaction.isRecurring = :isRecurring', { isRecurring: filters.isRecurring });
      }
    }

    // Ordenação
    query.orderBy('transaction.date', 'DESC')
      .addOrderBy('transaction.createdAt', 'DESC');

    // Paginação
    if (pagination) {
      const skip = (pagination.page - 1) * pagination.limit;
      query.skip(skip).take(pagination.limit);
    }

    const [transactions, total] = await query.getManyAndCount();

    return {
      transactions,
      total,
      page: pagination?.page || 1,
      limit: pagination?.limit || 10,
      totalPages: Math.ceil(total / (pagination?.limit || 10))
    };
  }

  async getSummary(userId: string, filters?: TransactionFiltersDto): Promise<TransactionSummaryDto> {
    const query = this.transactionRepository.createQueryBuilder('transaction')
      .leftJoin('transaction.account', 'account')
      .where('account.userId = :userId', { userId });

    if (filters) {
      if (filters.accountId) {
        query.andWhere('transaction.accountId = :accountId', { accountId: filters.accountId });
      }
      if (filters.startDate && filters.endDate) {
        query.andWhere('transaction.date BETWEEN :startDate AND :endDate', {
          startDate: filters.startDate,
          endDate: filters.endDate
        });
      }
    }

    const transactions = await query.getMany();

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

  async findOne(id: string, userId: string) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['category', 'account'] // Removido recurringTransaction que está comentado
    });

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada');
    }

    // Verificar se a conta pertence ao usuário
    if (transaction.account.userId !== userId) {
      throw new ForbiddenException('Acesso negado');
    }

    return transaction;
  }

  async create(createTransactionDto: CreateTransactionDto, userId: string) {
    // Verificar se a conta pertence ao usuário
    const account = await this.accountRepository.findOne({
      where: { id: createTransactionDto.accountId, userId }
    });

    if (!account) {
      throw new NotFoundException('Conta não encontrada');
    }

    const transaction = this.transactionRepository.create({
      description: createTransactionDto.description,
      amount: createTransactionDto.amount,
      type: createTransactionDto.type as any,
      status: createTransactionDto.status as any,
      accountId: createTransactionDto.accountId,
      categoryId: createTransactionDto.categoryId,
      date: new Date(createTransactionDto.date),
      notes: createTransactionDto.notes,
      isRecurring: createTransactionDto.isRecurring || false,
      recurringTransactionId: createTransactionDto.recurringTransactionId,
    });

    const savedTransaction = await this.transactionRepository.save(transaction);

    // Atualizar saldo da conta
    // await this.updateAccountBalance(account.id, createTransactionDto.amount); // Temporariamente comentado

    return savedTransaction;
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto, userId: string) {
    const transaction = await this.findOne(id, userId);

    const oldAmount = transaction.amount;
    const newAmount = updateTransactionDto.amount || oldAmount;

    // Atualizar transação
    Object.assign(transaction, updateTransactionDto);
    const updatedTransaction = await this.transactionRepository.save(transaction);

    // Atualizar saldo da conta se o valor mudou
    if (oldAmount !== newAmount) {
      await this.updateAccountBalance(transaction.accountId, newAmount - oldAmount);
    }

    return updatedTransaction;
  }

  async remove(id: string, userId: string) {
    const transaction = await this.findOne(id, userId);

    await this.transactionRepository.remove(transaction);

    // Atualizar saldo da conta (reverter o valor)
    await this.updateAccountBalance(transaction.accountId, -transaction.amount);

    return { message: 'Transação excluída com sucesso' };
  }

  async duplicate(id: string, userId: string) {
    const originalTransaction = await this.findOne(id, userId);

    const duplicatedTransaction = this.transactionRepository.create({
      ...originalTransaction,
      id: undefined,
      description: `${originalTransaction.description} (Cópia)`,
      date: new Date(),
      createdAt: undefined,
      updatedAt: undefined
    });

    const savedTransaction = await this.transactionRepository.save(duplicatedTransaction);

    // Atualizar saldo da conta
    await this.updateAccountBalance(originalTransaction.accountId, originalTransaction.amount);

    return this.findOne(savedTransaction.id, userId);
  }

  async getRecent(userId: string, limit: number = 10) {
    return this.transactionRepository.createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.category', 'category')
      .leftJoinAndSelect('transaction.account', 'account')
      .leftJoin('account.user', 'user')
      .where('user.id = :userId', { userId })
      .orderBy('transaction.date', 'DESC')
      .addOrderBy('transaction.createdAt', 'DESC')
      .limit(limit)
      .getMany();
  }

  async getUpcoming(userId: string, days: number = 7) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return this.transactionRepository.createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.category', 'category')
      .leftJoinAndSelect('transaction.account', 'account')
      .leftJoin('account.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('transaction.date > :today', { today: new Date() })
      .andWhere('transaction.date <= :futureDate', { futureDate })
      .orderBy('transaction.date', 'ASC')
      .getMany();
  }

  async getRecurring(userId: string) {
    return this.transactionRepository.createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.category', 'category')
      .leftJoinAndSelect('transaction.account', 'account')
      // .leftJoinAndSelect('transaction.recurringTransaction', 'recurring') // Comentado temporariamente
      .leftJoin('account.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('transaction.isRecurring = :isRecurring', { isRecurring: true })
      .orderBy('transaction.date', 'DESC')
      .getMany();
  }

  async bulkUpdate(bulkUpdateDto: BulkUpdateDto, userId: string) {
    const { transactionIds, updateData } = bulkUpdateDto;

    // Verificar se todas as transações pertencem ao usuário
    const transactions = await this.transactionRepository.find({
      where: { id: In(transactionIds) },
      relations: ['account']
    });

    const userTransactions = transactions.filter(t => t.account.userId === userId);

    if (userTransactions.length !== transactionIds.length) {
      throw new ForbiddenException('Algumas transações não pertencem ao usuário');
    }

    // Atualizar transações
    await this.transactionRepository.update(
      { id: In(transactionIds) },
      updateData
    );

    return { message: `${transactionIds.length} transações atualizadas com sucesso` };
  }

  async bulkDelete(bulkDeleteDto: BulkDeleteDto, userId: string) {
    const { transactionIds } = bulkDeleteDto;

    // Verificar se todas as transações pertencem ao usuário
    const transactions = await this.transactionRepository.find({
      where: { id: In(transactionIds) },
      relations: ['account']
    });

    const userTransactions = transactions.filter(t => t.account.userId === userId);

    if (userTransactions.length !== transactionIds.length) {
      throw new ForbiddenException('Algumas transações não pertencem ao usuário');
    }

    // Atualizar saldos das contas
    for (const transaction of userTransactions) {
      await this.updateAccountBalance(transaction.accountId, -transaction.amount);
    }

    // Excluir transações
    await this.transactionRepository.delete({ id: In(transactionIds) });

    return { message: `${transactionIds.length} transações excluídas com sucesso` };
  }

  async import(file: any, accountId: string, userId: string, options?: any): Promise<ImportResultDto> {
    // Temporariamente desabilitado - importExportService comentado
    throw new Error('Import functionality temporarily disabled');
  }

  async exportCsv(userId: string, filters?: TransactionFiltersDto, options?: ExportTransactionsDto): Promise<ExportResultDto> {
    // Temporariamente desabilitado - importExportService comentado
    throw new Error('Export CSV functionality temporarily disabled');
  }

  async exportPdf(userId: string, filters?: TransactionFiltersDto, options?: ExportTransactionsDto): Promise<ExportResultDto> {
    // Temporariamente desabilitado - importExportService comentado
    throw new Error('Export PDF functionality temporarily disabled');
  }

  async exportExcel(userId: string, filters?: TransactionFiltersDto, options?: ExportTransactionsDto): Promise<ExportResultDto> {
    // Temporariamente desabilitado - importExportService comentado
    throw new Error('Export Excel functionality temporarily disabled');
  }

  private async updateAccountBalance(accountId: string, amountChange: number) {
    try {
      await this.accountRepository.increment({ id: accountId }, 'balance', amountChange);
    } catch (error) {
      console.error('Erro ao atualizar saldo da conta:', error);
      // Não falhar a criação da transação se houver erro na atualização do saldo
    }
  }
}