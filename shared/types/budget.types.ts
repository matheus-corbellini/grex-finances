export interface Budget {
  id: string;
  userId: string;
  name: string;
  description?: string;
  period: BudgetPeriod;
  startDate: Date;
  endDate: Date;
  totalAmount: number;
  spentAmount: number;
  remainingAmount: number;
  categories: BudgetCategory[];
  isActive: boolean;
  alerts: BudgetAlert[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetCategory {
  id: string;
  budgetId: string;
  categoryId: string;
  subcategoryId?: string;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  warningThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetAlert {
  id: string;
  budgetId: string;
  categoryId?: string;
  type: AlertType;
  threshold: number;
  message: string;
  isTriggered: boolean;
  triggeredAt?: Date;
  createdAt: Date;
}

export enum BudgetPeriod {
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  QUARTERLY = "quarterly",
  YEARLY = "yearly",
  CUSTOM = "custom",
}

export enum AlertType {
  WARNING = "warning",
  LIMIT_REACHED = "limit_reached",
  OVER_BUDGET = "over_budget",
}

export interface CreateBudgetDto {
  name: string;
  description?: string;
  period: BudgetPeriod;
  startDate: Date;
  endDate: Date;
  categories: CreateBudgetCategoryDto[];
}

export interface CreateBudgetCategoryDto {
  categoryId: string;
  subcategoryId?: string;
  allocatedAmount: number;
  warningThreshold?: number;
}

export interface UpdateBudgetDto {
  name?: string;
  description?: string;
  period?: BudgetPeriod;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
}

export interface BudgetProgress {
  budgetId: string;
  totalProgress: number;
  categoryProgress: CategoryProgress[];
  daysRemaining: number;
  dailyBudget: number;
  projectedSpending: number;
}

export interface CategoryProgress {
  categoryId: string;
  categoryName: string;
  allocated: number;
  spent: number;
  remaining: number;
  progress: number;
  isOverBudget: boolean;
  daysRemaining: number;
}
