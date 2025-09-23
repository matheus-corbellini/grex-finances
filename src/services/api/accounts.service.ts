import BaseApiService from "./base.service";

export interface AccountType {
  id: string;
  name: string;
  category: string;
  description?: string;
  icon?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  typeId: string;
  type: AccountType;
  balance: number;
  currency: string;
  isActive: boolean;
  bankName?: string;
  accountNumber?: string;
  agency?: string;
  description?: string;
  color?: string;
  icon?: string;
  isArchived: boolean;
  archivedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountDto {
  name: string;
  type: 'bank' | 'wallet' | 'credit_card' | 'savings';
  bankName?: string;
  accountNumber?: string;
  agency?: string;
  initialBalance: number;
  description?: string;
  color?: string;
  icon?: string;
  currency?: string;
}

export interface UpdateAccountDto {
  name?: string;
  bankName?: string;
  accountNumber?: string;
  agency?: string;
  description?: string;
  isActive?: boolean;
}

export interface AccountBalanceUpdateDto {
  balance: number;
  reason?: string;
}

class AccountsService extends BaseApiService {
  constructor() {
    super();
    // Não definir baseURL aqui - usar o do BaseApiService
  }

  // Get all accounts
  async getAccounts(): Promise<Account[]> {
    return this.get<Account[]>("/accounts");
  }

  // Get account by ID
  async getAccountById(id: string): Promise<Account> {
    return this.get<Account>(`/accounts/${id}`);
  }

  // Create new account
  async createAccount(accountData: CreateAccountDto): Promise<Account> {
    return this.post<Account>("/accounts", accountData);
  }

  // Update account
  async updateAccount(id: string, accountData: UpdateAccountDto): Promise<Account> {
    return this.put<Account>(`/accounts/${id}`, accountData);
  }

  // Delete account
  async deleteAccount(id: string): Promise<void> {
    return this.delete<void>(`/accounts/${id}`);
  }

  // Update account balance
  async updateBalance(id: string, balanceData: AccountBalanceUpdateDto): Promise<Account> {
    return this.patch<Account>(`/accounts/${id}/balance`, balanceData);
  }

  // Get account transactions
  async getAccountTransactions(id: string, params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    transactions: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.get(`/accounts/${id}/transactions`, { params });
  }

  // Sync account with bank (if supported)
  async syncAccount(id: string): Promise<Account> {
    return this.post<Account>(`/accounts/${id}/sync`);
  }

  // Get account balance history
  async getBalanceHistory(id: string, params?: {
    startDate?: string;
    endDate?: string;
    period?: 'daily' | 'weekly' | 'monthly';
  }): Promise<{
    history: Array<{
      date: string;
      balance: number;
    }>;
  }> {
    return this.get(`/accounts/${id}/balance-history`, { params });
  }

  // Archive account (soft delete)
  async archiveAccount(id: string): Promise<void> {
    return this.patch<void>(`/accounts/${id}/archive`);
  }

  // Restore archived account
  async restoreAccount(id: string): Promise<Account> {
    return this.patch<Account>(`/accounts/${id}/restore`);
  }

  // Get archived accounts
  async getArchivedAccounts(): Promise<Account[]> {
    return this.get<Account[]>("/accounts/archived");
  }

  // Get accounts summary
  async getAccountsSummary(): Promise<{
    totalAccounts: number;
    totalBalance: number;
    activeAccounts: number;
    archivedAccounts: number;
    accountsByType: Record<string, number>;
  }> {
    return this.get("/accounts/summary");
  }
}

export default new AccountsService();