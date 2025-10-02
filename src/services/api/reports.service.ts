import BaseApiService from "./base.service";

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  period?: 'daily' | 'weekly' | 'monthly';
  regime?: 'cash' | 'accrual';
  considerUnpaid?: boolean;
}

export interface ReportSummary {
  totalIncome: number;
  totalExpenses: number;
  netResult: number;
  totalBalance: number;
  transactionCount: number;
}

export interface ReportData {
  summary: ReportSummary;
  periodData: { [key: string]: { income: number; expenses: number; net: number } };
  dateRange: {
    startDate: string;
    endDate: string;
  };
  filters: {
    period: string;
    regime: string;
    considerUnpaid: boolean;
  };
}

class ReportsService extends BaseApiService {
  constructor() {
    super();
  }

  // Get income and expense analysis
  async getIncomeExpenseAnalysis(filters: ReportFilters): Promise<ReportData> {
    const params = new URLSearchParams();
    
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.period) params.append('period', filters.period);
    if (filters.regime) params.append('regime', filters.regime);
    if (filters.considerUnpaid !== undefined) params.append('considerUnpaid', filters.considerUnpaid.toString());

    const queryString = params.toString();
    const url = `/reports/income-expense-analysis${queryString ? `?${queryString}` : ''}`;
    
    return this.get<ReportData>(url);
  }

  // Get cash flow report
  async getCashFlowReport(filters: any): Promise<any> {
    return this.get("/reports/cash-flow", { params: filters });
  }

  // Get category analysis
  async getCategoryAnalysis(filters: any): Promise<any> {
    return this.get("/reports/category-analysis", { params: filters });
  }

  // Get bank account analysis
  async getBankAccountAnalysis(filters: any): Promise<any> {
    return this.get("/reports/bank-account-analysis", { params: filters });
  }
}

export default new ReportsService();
