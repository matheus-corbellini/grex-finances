import BaseApiService from "./base.service";

export interface Account {
  id: string;
  name: string;
  type: 'bank' | 'wallet' | 'credit_card' | 'savings';
  bankName?: string;
  accountNumber?: string;
  agency?: string;
  balance: number;
  description?: string;
  isActive: boolean;
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
    this.baseURL = "/accounts";
  }

  // Get all accounts
  async getAccounts(): Promise<Account[]> {
    return this.get<Account[]>("/");
  }

  // Get account by ID
  async getAccountById(id: string): Promise<Account> {
    return this.get<Account>(`/${id}`);
  }

  // Create new account
  async createAccount(accountData: CreateAccountDto): Promise<Account> {
    return this.post<Account>("/", accountData);
  }

  // Update account
  async updateAccount(id: string, accountData: UpdateAccountDto): Promise<Account> {
    return this.put<Account>(`/${id}`, accountData);
  }

  // Delete account
  async deleteAccount(id: string): Promise<void> {
    return this.delete<void>(`/${id}`);
  }

  // Update account balance
  async updateBalance(id: string, balanceData: AccountBalanceUpdateDto): Promise<Account> {
    return this.patch<Account>(`/${id}/balance`, balanceData);
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
    return this.get(`/${id}/transactions`, { params });
  }

  // Sync account with bank (if supported)
  async syncAccount(id: string): Promise<Account> {
    return this.post<Account>(`/${id}/sync`);
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
    return this.get(`/${id}/balance-history`, { params });
  }

  // Archive account (soft delete)
  async archiveAccount(id: string): Promise<void> {
    return this.patch<void>(`/${id}/archive`);
  }

  // Restore archived account
  async restoreAccount(id: string): Promise<Account> {
    return this.patch<Account>(`/${id}/restore`);
  }

  // Get archived accounts
  async getArchivedAccounts(): Promise<Account[]> {
    return this.get<Account[]>("/archived");
  }

  // Get accounts summary
  async getAccountsSummary(): Promise<{
    totalAccounts: number;
    totalBalance: number;
    activeAccounts: number;
    archivedAccounts: number;
    accountsByType: Record<string, number>;
  }> {
    return this.get("/summary");
  }
}

export default new AccountsService();