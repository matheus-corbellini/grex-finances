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

    const response = await this.get<any>("/transactions", { params });
    
    // Transform the mock server response to match expected PaginatedResponse structure
    return {
      data: response.transactions || response.data || [],
      pagination: {
        page: response.page || 1,
        limit: response.limit || 10,
        total: response.total || 0,
        totalPages: response.totalPages || 0,
        hasNext: (response.page || 1) < (response.totalPages || 0),
        hasPrev: (response.page || 1) > 1
      }
    };
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
    accountId: string,
    options?: any
  ): Promise<{
    totalProcessed: number;
    successCount: number;
    errorCount: number;
    duplicateCount: number;
    errors: Array<{
      row: number;
      field: string;
      message: string;
      data: any;
    }>;
    importedTransactions: any[];
  }> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("accountId", accountId);

    if (options) {
      formData.append("options", JSON.stringify(options));
    }

    return this.post(
      "/transactions/import",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  }

  async exportTransactionsCsv(filter?: TransactionFilter, options?: any): Promise<void> {
    const params = { ...filter, ...options };
    const response = await this.api.get("/transactions/export/csv", {
      params,
      responseType: "blob",
    });

    this.downloadFile(response.data, `transacoes_${new Date().toISOString().split('T')[0]}.csv`);
  }

  async exportTransactionsPdf(filter?: TransactionFilter, options?: any): Promise<void> {
    const params = { ...filter, ...options };
    const response = await this.api.get("/transactions/export/pdf", {
      params,
      responseType: "blob",
    });

    this.downloadFile(response.data, `transacoes_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  async exportTransactionsExcel(filter?: TransactionFilter, options?: any): Promise<void> {
    const params = { ...filter, ...options };
    const response = await this.api.get("/transactions/export/excel", {
      params,
      responseType: "blob",
    });

    this.downloadFile(response.data, `transacoes_${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  async downloadImportTemplate(): Promise<void> {
    const response = await this.api.get("/transactions/import/template", {
      responseType: "blob",
    });

    this.downloadFile(response.data, "template-importacao-transacoes.csv");
  }

  private downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

export default new TransactionsService();