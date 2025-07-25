export interface Goal {
  id: string;
  userId: string;
  name: string;
  description?: string;
  type: GoalType;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  priority: Priority;
  status: GoalStatus;
  accountId?: string;
  categoryId?: string;
  icon?: string;
  color?: string;
  progress: GoalProgress[];
  reminders: GoalReminder[];
  createdAt: Date;
  updatedAt: Date;
}

export enum GoalType {
  SAVINGS = "savings",
  DEBT_PAYOFF = "debt_payoff",
  INVESTMENT = "investment",
  PURCHASE = "purchase",
  EMERGENCY_FUND = "emergency_fund",
  RETIREMENT = "retirement",
  EDUCATION = "education",
  VACATION = "vacation",
  OTHER = "other",
}

export enum Priority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export enum GoalStatus {
  ACTIVE = "active",
  PAUSED = "paused",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface GoalProgress {
  id: string;
  goalId: string;
  amount: number;
  note?: string;
  date: Date;
  transactionId?: string;
  createdAt: Date;
}

export interface GoalReminder {
  id: string;
  goalId: string;
  type: ReminderType;
  frequency: ReminderFrequency;
  message: string;
  isActive: boolean;
  lastSent?: Date;
  nextSend: Date;
  createdAt: Date;
}

export enum ReminderType {
  CONTRIBUTION = "contribution",
  DEADLINE = "deadline",
  MILESTONE = "milestone",
}

export enum ReminderFrequency {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  QUARTERLY = "quarterly",
}

export interface CreateGoalDto {
  name: string;
  description?: string;
  type: GoalType;
  targetAmount: number;
  targetDate: Date;
  priority: Priority;
  accountId?: string;
  categoryId?: string;
  icon?: string;
  color?: string;
}

export interface UpdateGoalDto {
  name?: string;
  description?: string;
  targetAmount?: number;
  targetDate?: Date;
  priority?: Priority;
  status?: GoalStatus;
  icon?: string;
  color?: string;
}

export interface GoalInsights {
  goalId: string;
  progressPercentage: number;
  daysRemaining: number;
  requiredMonthlyContribution: number;
  currentMonthlyContribution: number;
  projectedCompletionDate: Date;
  isOnTrack: boolean;
  recommendations: string[];
}
