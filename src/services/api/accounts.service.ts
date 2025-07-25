import BaseApiService from "./base.service";
import {
  Account,
  AccountType,
  CreateAccountDto,
  UpdateAccountDto,
  AccountBalance,
  AccountSummary,
  PaginatedResponse,
  RequestOptions,
} from "../../../shared/types";

class AccountsService extends BaseApiService {
  async getAccounts(
    options?: RequestOptions
  ): Promise<PaginatedResponse<Account>> {
    return this.getPaginated<Account>("/accounts", options);
  }

  async getAccount(id: string): Promise<Account> {
    return this.get<Account>(`/accounts/${id}`);
  }

  async createAccount(data: CreateAccountDto): Promise<Account> {
    return this.post<Account>("/accounts", data);
  }

  async updateAccount(id: string, data: UpdateAccountDto): Promise<Account> {
    return this.patch<Account>(`/accounts/${id}`, data);
  }

  async deleteAccount(id: string): Promise<void> {
    await this.delete(`/accounts/${id}`);
  }

  async getAccountTypes(): Promise<AccountType[]> {
    return this.get<AccountType[]>("/account-types");
  }

  async getAccountBalance(id: string): Promise<AccountBalance> {
    return this.get<AccountBalance>(`/accounts/${id}/balance`);
  }

  async getAccountsBalance(accountIds?: string[]): Promise<AccountBalance[]> {
    const params = accountIds ? { accountIds: accountIds.join(",") } : {};
    return this.get<AccountBalance[]>("/accounts/balance", { params });
  }

  async getAccountSummary(): Promise<AccountSummary> {
    return this.get<AccountSummary>("/accounts/summary");
  }

  async updateAccountBalance(
    id: string,
    balance: number
  ): Promise<AccountBalance> {
    return this.patch<AccountBalance>(`/accounts/${id}/balance`, { balance });
  }

  async syncAccountBalance(id: string): Promise<AccountBalance> {
    return this.post<AccountBalance>(`/accounts/${id}/sync`);
  }

  async toggleAccountStatus(id: string): Promise<Account> {
    return this.patch<Account>(`/accounts/${id}/toggle-status`);
  }
}

export default new AccountsService();
