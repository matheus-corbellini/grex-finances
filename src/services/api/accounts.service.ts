import BaseApiService from "./base.service";
import { Account } from "../../../shared/types/account.types";

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
    try {
      console.log("🔍 ACCOUNTS SERVICE - Chamando GET /accounts");
      const result = await this.get<Account[]>("/accounts");
      console.log("🔍 ACCOUNTS SERVICE - Resultado recebido:", result);
      return result;
    } catch (error) {
      console.error("❌ ACCOUNTS SERVICE - Erro ao buscar contas:", error);
      throw error;
    }
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
    try {
      return await this.delete<void>(`/accounts/${id}`);
    } catch (error: any) {
      console.error('=== ERRO AO EXCLUIR CONTA ===');
      console.error('Account ID:', id);
      console.error('Error message:', error?.message);
      console.error('Error code:', error?.code);
      console.error('Error details:', error?.details);
      console.error('HTTP status:', error?.response?.status);
      console.error('Response data:', error?.response?.data);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      console.error('Error keys:', Object.keys(error || {}));

      // Re-throw the error with better structure
      const enhancedError = {
        message: error?.message || error?.response?.data?.message || 'Erro ao excluir conta',
        code: error?.code || error?.response?.data?.code || 'DELETE_ERROR',
        details: error?.details || error?.response?.data?.details,
        status: error?.response?.status,
        originalError: error
      };

      console.error('Enhanced error being thrown:', JSON.stringify(enhancedError, null, 2));
      throw enhancedError;
    }
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
    try {
      const response = await this.get<{ history: Array<{ date: string; balance: number; }> }>(`/accounts/${id}/balance-history`, { params });
      return response;
    } catch (error: any) {
      console.error('=== ERRO AO BUSCAR HISTÓRICO DE SALDOS ===');
      console.error('Account ID:', id);
      console.error('URL:', `/accounts/${id}/balance-history`);
      console.error('Params:', params);
      console.error('Error message:', error?.message);
      console.error('Error code:', error?.code);
      console.error('HTTP status:', error?.response?.status);
      console.error('Response data:', error?.response?.data);
      console.error('Full error JSON:', JSON.stringify(error, null, 2));
      console.error('Error keys:', Object.keys(error || {}));

      // Retornar dados vazios em caso de erro
      return { history: [] };
    }
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