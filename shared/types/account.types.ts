export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  isActive: boolean;
  bankName?: string;
  accountNumber?: string;
  description?: string;
  color?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountType {
  id: string;
  name: string;
  category: AccountCategory;
  description?: string;
  icon?: string;
}

export enum AccountCategory {
  CHECKING = "checking",
  SAVINGS = "savings",
  CREDIT_CARD = "credit_card",
  INVESTMENT = "investment",
  CASH = "cash",
  LOAN = "loan",
  OTHER = "other",
}

export interface CreateAccountDto {
  name: string;
  typeId: string;
  balance: number;
  currency: string;
  bankName?: string;
  accountNumber?: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface UpdateAccountDto {
  name?: string;
  balance?: number;
  bankName?: string;
  accountNumber?: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive?: boolean;
}

export interface AccountBalance {
  accountId: string;
  balance: number;
  availableBalance?: number;
  pendingBalance?: number;
  lastUpdated: Date;
}

export interface AccountSummary {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  accountsByType: Record<AccountCategory, Account[]>;
}
