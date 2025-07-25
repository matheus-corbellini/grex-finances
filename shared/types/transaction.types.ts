export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  categoryId?: string;
  subcategoryId?: string;
  amount: number;
  description: string;
  notes?: string;
  type: TransactionType;
  status: TransactionStatus;
  date: Date;
  tags?: string[];
  location?: string;
  receipt?: string;
  isRecurring: boolean;
  recurringTransactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense",
  TRANSFER = "transfer",
}

export enum TransactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  FAILED = "failed",
}

export interface RecurringTransaction {
  id: string;
  userId: string;
  accountId: string;
  categoryId?: string;
  amount: number;
  description: string;
  type: TransactionType;
  frequency: RecurrenceFrequency;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  nextExecutionDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum RecurrenceFrequency {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  QUARTERLY = "quarterly",
  YEARLY = "yearly",
}

export interface CreateTransactionDto {
  accountId: string;
  categoryId?: string;
  subcategoryId?: string;
  amount: number;
  description: string;
  notes?: string;
  type: TransactionType;
  date: Date;
  tags?: string[];
  location?: string;
}

export interface UpdateTransactionDto {
  categoryId?: string;
  subcategoryId?: string;
  amount?: number;
  description?: string;
  notes?: string;
  date?: Date;
  tags?: string[];
  location?: string;
}

export interface TransactionFilter {
  accountIds?: string[];
  categoryIds?: string[];
  type?: TransactionType;
  status?: TransactionStatus;
  minAmount?: number;
  maxAmount?: number;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  transactionCount: number;
  averageTransaction: number;
  largestIncome: number;
  largestExpense: number;
}
