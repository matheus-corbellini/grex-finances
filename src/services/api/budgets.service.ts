import BaseApiService from "./base.service";
import {
  Budget,
  CreateBudgetDto,
  UpdateBudgetDto,
  BudgetProgress,
  BudgetAlert,
  PaginatedResponse,
  RequestOptions,
} from "../../../shared/types";

class BudgetsService extends BaseApiService {
  async getBudgets(
    options?: RequestOptions
  ): Promise<PaginatedResponse<Budget>> {
    return this.getPaginated<Budget>("/budgets", options);
  }

  async getBudget(id: string): Promise<Budget> {
    return this.get<Budget>(`/budgets/${id}`);
  }

  async createBudget(data: CreateBudgetDto): Promise<Budget> {
    return this.post<Budget>("/budgets", data);
  }

  async updateBudget(id: string, data: UpdateBudgetDto): Promise<Budget> {
    return this.patch<Budget>(`/budgets/${id}`, data);
  }

  async deleteBudget(id: string): Promise<void> {
    await this.delete(`/budgets/${id}`);
  }

  async getBudgetProgress(id: string): Promise<BudgetProgress> {
    return this.get<BudgetProgress>(`/budgets/${id}/progress`);
  }

  async getCurrentBudget(): Promise<Budget | null> {
    try {
      return await this.get<Budget>("/budgets/current");
    } catch (error) {
      return null;
    }
  }

  async getBudgetAlerts(budgetId?: string): Promise<BudgetAlert[]> {
    const url = budgetId ? `/budgets/${budgetId}/alerts` : "/budgets/alerts";
    return this.get<BudgetAlert[]>(url);
  }

  async createBudgetAlert(
    budgetId: string,
    alert: Partial<BudgetAlert>
  ): Promise<BudgetAlert> {
    return this.post<BudgetAlert>(`/budgets/${budgetId}/alerts`, alert);
  }

  async updateBudgetAlert(
    alertId: string,
    data: Partial<BudgetAlert>
  ): Promise<BudgetAlert> {
    return this.patch<BudgetAlert>(`/budget-alerts/${alertId}`, data);
  }

  async deleteBudgetAlert(alertId: string): Promise<void> {
    await this.delete(`/budget-alerts/${alertId}`);
  }

  async duplicateBudget(id: string, name: string): Promise<Budget> {
    return this.post<Budget>(`/budgets/${id}/duplicate`, { name });
  }

  async toggleBudgetStatus(id: string): Promise<Budget> {
    return this.patch<Budget>(`/budgets/${id}/toggle-status`);
  }

  async getBudgetComparison(
    budgetId: string,
    compareWithId: string
  ): Promise<any> {
    return this.get(`/budgets/${budgetId}/compare/${compareWithId}`);
  }

  async getBudgetRecommendations(id: string): Promise<string[]> {
    return this.get<string[]>(`/budgets/${id}/recommendations`);
  }
}

export default new BudgetsService();
