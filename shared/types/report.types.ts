import { Transaction } from "./transaction.types";
import { Investment } from "./investment.types";

export interface Report {
  id: string;
  userId: string;
  name: string;
  type: ReportType;
  description?: string;
  parameters: ReportParameters;
  data: ReportData;
  generatedAt: Date;
  isScheduled: boolean;
  schedule?: ReportSchedule;
}

export enum ReportType {
  INCOME_STATEMENT = "income_statement",
  CASH_FLOW = "cash_flow",
  NET_WORTH = "net_worth",
  SPENDING_ANALYSIS = "spending_analysis",
  BUDGET_PERFORMANCE = "budget_performance",
  INVESTMENT_PERFORMANCE = "investment_performance",
  GOAL_PROGRESS = "goal_progress",
  TRANSACTION_SUMMARY = "transaction_summary",
  CATEGORY_BREAKDOWN = "category_breakdown",
  ACCOUNT_SUMMARY = "account_summary",
}

export interface ReportParameters {
  dateRange: DateRange;
  accountIds?: string[];
  categoryIds?: string[];
  portfolioIds?: string[];
  goalIds?: string[];
  currency?: string;
  groupBy?: "day" | "week" | "month" | "quarter" | "year";
  includeSubcategories?: boolean;
  compareWithPrevious?: boolean;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
  period: "custom" | "1M" | "3M" | "6M" | "1Y" | "YTD" | "ALL";
}

export interface ReportData {
  summary: ReportSummary;
  details: any[];
  charts: ChartData[];
  insights: ReportInsight[];
}

export interface ReportSummary {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  period: string;
  currency: string;
}

export interface ChartData {
  type: "line" | "bar" | "pie" | "doughnut" | "area";
  title: string;
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string[];
      borderColor?: string;
    }[];
  };
}

export interface ReportInsight {
  type: InsightType;
  title: string;
  description: string;
  value?: number;
  change?: number;
  changePercentage?: number;
  trend?: "up" | "down" | "stable";
  severity?: "info" | "warning" | "danger" | "success";
}

export enum InsightType {
  SPENDING_TREND = "spending_trend",
  INCOME_CHANGE = "income_change",
  BUDGET_VARIANCE = "budget_variance",
  INVESTMENT_PERFORMANCE = "investment_performance",
  GOAL_PROGRESS = "goal_progress",
  CATEGORY_ANALYSIS = "category_analysis",
  ACCOUNT_BALANCE = "account_balance",
}

export interface ReportSchedule {
  frequency: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  dayOfWeek?: number;
  dayOfMonth?: number;
  hour: number;
  isActive: boolean;
  lastGenerated?: Date;
  nextGeneration: Date;
}

export interface CreateReportDto {
  name: string;
  type: ReportType;
  description?: string;
  parameters: ReportParameters;
  isScheduled?: boolean;
  schedule?: Partial<ReportSchedule>;
}

export interface DashboardData {
  netWorth: number;
  netWorthChange: number;
  totalAssets: number;
  totalLiabilities: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  budgetProgress: BudgetProgressSummary;
  recentTransactions: Transaction[];
  upcomingBills: Transaction[];
  goalProgress: GoalProgressSummary[];
  investmentSummary: PortfolioSummary;
}

export interface BudgetProgressSummary {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  progressPercentage: number;
  categoriesOverBudget: number;
}

export interface GoalProgressSummary {
  goalId: string;
  name: string;
  progressPercentage: number;
  targetAmount: number;
  currentAmount: number;
  daysRemaining: number;
}

export interface PortfolioSummary {
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
  diversificationScore: number;
  topPerformers: Investment[];
  topLosers: Investment[];
}
