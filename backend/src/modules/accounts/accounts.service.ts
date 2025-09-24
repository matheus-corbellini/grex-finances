import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between, Like, In } from "typeorm";
import { Account } from "./entities/account.entity";
import { AccountType } from "./entities/account-type.entity";
import { AccountBalanceHistory } from "./entities/account-balance-history.entity";
import {
  CreateAccountDto,
  UpdateAccountDto,
  AccountBalanceUpdateDto,
  AccountFiltersDto,
  TransactionFiltersDto,
  HistoryFiltersDto,
  AccountSummaryDto,
  AccountTypeEnum
} from "./dto";

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(AccountType)
    private accountTypeRepository: Repository<AccountType>,
    @InjectRepository(AccountBalanceHistory)
    private balanceHistoryRepository: Repository<AccountBalanceHistory>,
  ) { }

  async findAll(userId: string, filters?: AccountFiltersDto): Promise<Account[]> {
    const query = this.accountRepository.createQueryBuilder('account')
      .leftJoinAndSelect('account.type', 'type')
      .where('account.userId = :userId', { userId });

    if (filters) {
      if (filters.type) {
        query.andWhere('account.typeId = (SELECT id FROM account_types WHERE category = :type)', { type: filters.type });
      }
      if (filters.bankName) {
        query.andWhere('account.bankName LIKE :bankName', { bankName: `%${filters.bankName}%` });
      }
      if (filters.isActive !== undefined) {
        query.andWhere('account.isActive = :isActive', { isActive: filters.isActive });
      }
      if (filters.isArchived !== undefined) {
        query.andWhere('account.isArchived = :isArchived', { isArchived: filters.isArchived });
      }
      if (filters.search) {
        query.andWhere('account.name LIKE :search', { search: `%${filters.search}%` });
      }
    }

    return query.getMany();
  }

  async findOne(id: string, userId: string): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { id, userId },
      relations: ['type']
    });

    if (!account) {
      throw new NotFoundException('Conta não encontrada');
    }

    return account;
  }

  async create(createAccountDto: CreateAccountDto, userId: string): Promise<Account> {
    // Buscar tipo de conta
    const accountType = await this.accountTypeRepository.findOne({
      where: { category: createAccountDto.type }
    });

    if (!accountType) {
      throw new BadRequestException('Tipo de conta inválido');
    }

    // Criar conta
    const account = this.accountRepository.create({
      name: createAccountDto.name,
      userId,
      typeId: accountType.id,
      balance: createAccountDto.initialBalance,
      currency: createAccountDto.currency || 'BRL',
      isActive: true,
      isArchived: false,
      bankName: createAccountDto.bankName,
      accountNumber: createAccountDto.accountNumber,
      agency: createAccountDto.agency,
      description: createAccountDto.description,
      color: createAccountDto.color,
      icon: createAccountDto.icon,
    });

    const savedAccount = await this.accountRepository.save(account);

    // Registrar histórico de saldo inicial
    await this.recordBalanceHistory(savedAccount.id, 0, createAccountDto.initialBalance, 'Criação da conta');

    return this.findOne(savedAccount.id, userId);
  }

  async update(id: string, updateAccountDto: UpdateAccountDto, userId: string): Promise<Account> {
    const account = await this.findOne(id, userId);

    // Atualizar conta
    Object.assign(account, updateAccountDto);
    const updatedAccount = await this.accountRepository.save(account);

    return this.findOne(updatedAccount.id, userId);
  }

  async remove(id: string, userId: string): Promise<void> {
    const account = await this.findOne(id, userId);
    await this.accountRepository.remove(account);
  }

  async updateBalance(id: string, balanceData: AccountBalanceUpdateDto, userId: string): Promise<Account> {
    const account = await this.findOne(id, userId);

    const previousBalance = account.balance;
    const newBalance = balanceData.balance;
    const difference = newBalance - previousBalance;

    // Atualizar saldo
    account.balance = newBalance;
    const updatedAccount = await this.accountRepository.save(account);

    // Registrar histórico
    await this.recordBalanceHistory(
      id,
      previousBalance,
      newBalance,
      balanceData.reason || 'Ajuste manual de saldo'
    );

    return this.findOne(updatedAccount.id, userId);
  }

  async getTransactions(id: string, userId: string, filters?: TransactionFiltersDto): Promise<{
    transactions: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    // Verificar se a conta pertence ao usuário
    await this.findOne(id, userId);

    // TODO: Implementar busca de transações quando o módulo de transações estiver pronto
    // Por enquanto, retornar dados vazios
    return {
      transactions: [],
      total: 0,
      page: filters?.page || 1,
      limit: filters?.limit || 10
    };
  }

  async syncAccount(id: string, userId: string): Promise<Account> {
    const account = await this.findOne(id, userId);

    // TODO: Implementar sincronização com APIs bancárias
    // Por enquanto, apenas retornar a conta atual
    return account;
  }

  async getBalanceHistory(id: string, userId: string, filters?: HistoryFiltersDto): Promise<{
    history: Array<{
      date: string;
      balance: number;
    }>;
  }> {
    // Verificar se a conta pertence ao usuário
    await this.findOne(id, userId);

    const query = this.balanceHistoryRepository.createQueryBuilder('history')
      .where('history.accountId = :accountId', { accountId: id })
      .orderBy('history.createdAt', 'ASC');

    if (filters?.startDate) {
      query.andWhere('history.createdAt >= :startDate', { startDate: filters.startDate });
    }
    if (filters?.endDate) {
      query.andWhere('history.createdAt <= :endDate', { endDate: filters.endDate });
    }

    const history = await query.getMany();

    return {
      history: history.map(h => ({
        date: h.createdAt.toISOString(),
        balance: parseFloat(h.newBalance.toString())
      }))
    };
  }

  async archive(id: string, userId: string): Promise<void> {
    const account = await this.findOne(id, userId);

    account.isArchived = true;
    account.archivedAt = new Date();

    await this.accountRepository.save(account);
  }

  async restore(id: string, userId: string): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { id, userId, isArchived: true }
    });

    if (!account) {
      throw new NotFoundException('Conta arquivada não encontrada');
    }

    account.isArchived = false;
    account.archivedAt = null;

    const restoredAccount = await this.accountRepository.save(account);
    return this.findOne(restoredAccount.id, userId);
  }

  async getArchived(userId: string): Promise<Account[]> {
    return this.accountRepository.find({
      where: { userId, isArchived: true },
      relations: ['type']
    });
  }

  async getSummary(userId: string): Promise<AccountSummaryDto> {
    const accounts = await this.accountRepository.find({
      where: { userId },
      relations: ['type']
    });

    const totalAccounts = accounts.length;
    const totalBalance = accounts.reduce((sum, account) => sum + parseFloat(account.balance.toString()), 0);
    const activeAccounts = accounts.filter(account => account.isActive && !account.isArchived).length;
    const archivedAccounts = accounts.filter(account => account.isArchived).length;

    const accountsByType = accounts.reduce((acc, account) => {
      const type = account.type.category;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalAccounts,
      totalBalance,
      activeAccounts,
      archivedAccounts,
      accountsByType
    };
  }

  private async recordBalanceHistory(
    accountId: string,
    previousBalance: number,
    newBalance: number,
    reason: string,
    source: string = 'manual'
  ): Promise<void> {
    const history = this.balanceHistoryRepository.create({
      accountId,
      previousBalance,
      newBalance,
      difference: newBalance - previousBalance,
      reason,
      source
    });

    await this.balanceHistoryRepository.save(history);
  }
} 