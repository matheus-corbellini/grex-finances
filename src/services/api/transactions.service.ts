import BaseApiService from "./base.service";
import {
  Transaction,
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionFilter,
  TransactionSummary,
  RecurringTransaction,
  PaginatedResponse,
  RequestOptions,
} from "../../../shared/types";

class TransactionsService extends BaseApiService {
  async getTransactions(
    filter?: TransactionFilter,
    options?: RequestOptions
  ): Promise<PaginatedResponse<Transaction>> {
    const params = {
      ...options?.filter,
      ...filter,
      page: options?.page || 1,
      limit: options?.limit || 10
    };

    return this.get<PaginatedResponse<Transaction>>("/transactions", { params });
  }

  async getTransaction(id: string): Promise<Transaction> {
    return this.get<Transaction>(`/transactions/${id}`);
  }

  async createTransaction(data: CreateTransactionDto): Promise<Transaction> {
    return this.post<Transaction>("/transactions", data);
  }

  async updateTransaction(
    id: string,
    data: UpdateTransactionDto
  ): Promise<Transaction> {
    return this.put<Transaction>(`/transactions/${id}`, data);
  }

  async deleteTransaction(id: string): Promise<void> {
    return this.delete<void>(`/transactions/${id}`);
  }

  async getCategories(): Promise<any[]> {
    return this.get<any[]>("/categories");
  }

  async duplicateTransaction(id: string): Promise<Transaction> {
    return this.post<Transaction>(`/transactions/${id}/duplicate`);
  }

  async getTransactionSummary(
    filter?: TransactionFilter
  ): Promise<TransactionSummary> {
    return this.get<TransactionSummary>("/transactions/summary", {
      params: filter,
    });
  }

  async getRecurringTransactions(
    options?: RequestOptions
  ): Promise<PaginatedResponse<RecurringTransaction>> {
    return this.getPaginated<RecurringTransaction>(
      "/transactions/recurring",
      options
    );
  }

  async createRecurringTransaction(
    data: Partial<RecurringTransaction>
  ): Promise<RecurringTransaction> {
    return this.post<RecurringTransaction>("/transactions/recurring", data);
  }

  async updateRecurringTransaction(
    id: string,
    data: Partial<RecurringTransaction>
  ): Promise<RecurringTransaction> {
    return this.patch<RecurringTransaction>(
      `/transactions/recurring/${id}`,
      data
    );
  }

  async deleteRecurringTransaction(id: string): Promise<void> {
    await this.delete(`/transactions/recurring/${id}`);
  }

  async toggleRecurringTransaction(id: string): Promise<RecurringTransaction> {
    return this.patch<RecurringTransaction>(
      `/transactions/recurring/${id}/toggle`
    );
  }

  async getRecentTransactions(limit = 10): Promise<Transaction[]> {
    return this.get<Transaction[]>("/transactions/recent", {
      params: { limit },
    });
  }

  async getUpcomingTransactions(days = 7): Promise<Transaction[]> {
    return this.get<Transaction[]>("/transactions/upcoming", {
      params: { days },
    });
  }

  async bulkDeleteTransactions(ids: string[]): Promise<void> {
    await this.delete("/transactions/bulk", { data: { ids } });
  }

  async bulkUpdateTransactions(
    ids: string[],
    data: Partial<UpdateTransactionDto>
  ): Promise<Transaction[]> {
    return this.patch<Transaction[]>("/transactions/bulk", { ids, ...data });
  }

  async importTransactions(
    file: File,
    accountId: string
  ): Promise<{ imported: number; errors: any[] }> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("accountId", accountId);

    return this.post<{ imported: number; errors: any[] }>(
      "/transactions/import",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  }

  async exportTransactions(filter?: TransactionFilter): Promise<Blob> {
    const response = await this.api.get("/transactions/export", {
      params: filter,
      responseType: "blob",
    });
    return response.data;
  }
}

export default new TransactionsService();