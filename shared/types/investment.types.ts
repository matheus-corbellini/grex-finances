export interface Investment {
  id: string;
  userId: string;
  portfolioId: string;
  symbol: string;
  name: string;
  type: InvestmentType;
  quantity: number;
  currentPrice: number;
  purchasePrice: number;
  totalValue: number;
  totalCost: number;
  gainLoss: number;
  gainLossPercentage: number;
  dividendYield?: number;
  sector?: string;
  exchange?: string;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvestmentType {
  id: string;
  name: string;
  category: InvestmentCategory;
  description?: string;
  riskLevel: RiskLevel;
}

export enum InvestmentCategory {
  STOCKS = "stocks",
  BONDS = "bonds",
  MUTUAL_FUNDS = "mutual_funds",
  ETF = "etf",
  CRYPTOCURRENCY = "cryptocurrency",
  REAL_ESTATE = "real_estate",
  COMMODITIES = "commodities",
  OTHER = "other",
}

export enum RiskLevel {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  VERY_HIGH = "very_high",
}

export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  description?: string;
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
  diversification: Diversification;
  investments: Investment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Diversification {
  byAssetType: AssetAllocation[];
  bySector: SectorAllocation[];
  byRiskLevel: RiskAllocation[];
}

export interface AssetAllocation {
  category: InvestmentCategory;
  percentage: number;
  value: number;
}

export interface SectorAllocation {
  sector: string;
  percentage: number;
  value: number;
}

export interface RiskAllocation {
  riskLevel: RiskLevel;
  percentage: number;
  value: number;
}

export interface InvestmentTransaction {
  id: string;
  userId: string;
  investmentId: string;
  type: InvestmentTransactionType;
  quantity: number;
  price: number;
  totalAmount: number;
  fees?: number;
  date: Date;
  notes?: string;
  createdAt: Date;
}

export enum InvestmentTransactionType {
  BUY = "buy",
  SELL = "sell",
  DIVIDEND = "dividend",
  SPLIT = "split",
  MERGER = "merger",
}

export interface CreateInvestmentDto {
  portfolioId: string;
  symbol: string;
  name: string;
  typeId: string;
  quantity: number;
  purchasePrice: number;
}

export interface UpdateInvestmentDto {
  quantity?: number;
  currentPrice?: number;
}

export interface CreatePortfolioDto {
  name: string;
  description?: string;
}

export interface PortfolioPerformance {
  portfolioId: string;
  timeframe: "1D" | "1W" | "1M" | "3M" | "6M" | "1Y" | "ALL";
  totalReturn: number;
  totalReturnPercentage: number;
  annualizedReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
}
