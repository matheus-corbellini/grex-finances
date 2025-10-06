import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between, In } from "typeorm";
import { Transaction } from "../transactions/entities/transaction.entity";
import { Account } from "../accounts/entities/account.entity";
import { Category } from "../categories/entities/category.entity";
import { CreditCard } from "../credit-cards/entities/credit-card.entity";
import { Contact } from "../contacts/entities/contact.entity";

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(CreditCard)
    private creditCardRepository: Repository<CreditCard>,
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
  ) { }

  async getIncomeExpenseAnalysis(userId: string, filters: {
    startDate?: string;
    endDate?: string;
    period?: 'daily' | 'weekly' | 'monthly';
    regime?: 'cash' | 'accrual';
    considerUnpaid?: boolean;
  }) {
    const { startDate, endDate, period = 'monthly', regime = 'cash', considerUnpaid = false } = filters;

    // Definir datas padrão se não fornecidas
    const defaultStartDate = startDate || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    const defaultEndDate = endDate || new Date().toISOString();

    console.log(`📊 Gerando relatório de entradas e saídas para usuário ${userId}`);
    console.log(`   Período: ${defaultStartDate} a ${defaultEndDate}`);
    console.log(`   Regime: ${regime}, Considerar não pagos: ${considerUnpaid}`);

    try {
      // Buscar transações do usuário no período
      const queryBuilder = this.transactionRepository
        .createQueryBuilder('transaction')
        .leftJoin('transaction.account', 'account')
        .where('account.userId = :userId', { userId })
        .andWhere('transaction.date >= :startDate', { startDate: defaultStartDate })
        .andWhere('transaction.date <= :endDate', { endDate: defaultEndDate });

      // Filtrar por status se regime for 'cash' e não considerar não pagos
      if (regime === 'cash' && !considerUnpaid) {
        queryBuilder.andWhere('transaction.status = :status', { status: 'completed' });
      }

      const transactions = await queryBuilder.getMany();

      console.log(`   Encontradas ${transactions.length} transações`);

      // Separar receitas e despesas
      const incomeTransactions = transactions.filter(t => t.type === 'income');
      const expenseTransactions = transactions.filter(t => t.type === 'expense');

      // Calcular totais
      const totalIncome = incomeTransactions.reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
      const totalExpenses = expenseTransactions.reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
      const netResult = totalIncome - totalExpenses;

      // Agrupar por período
      const groupedData = this.groupTransactionsByPeriod(transactions, period);

      // Calcular saldo acumulado
      const accounts = await this.accountRepository.find({ where: { userId } });
      const totalBalance = accounts.reduce((sum, account) => sum + parseFloat(account.balance.toString()), 0);

      const reportData = {
        summary: {
          totalIncome,
          totalExpenses,
          netResult,
          totalBalance,
          transactionCount: transactions.length
        },
        periodData: groupedData,
        dateRange: {
          startDate: defaultStartDate,
          endDate: defaultEndDate
        },
        filters: {
          period,
          regime,
          considerUnpaid
        }
      };

      console.log(`✅ Relatório gerado com sucesso:`);
      console.log(`   Receitas: R$ ${totalIncome.toFixed(2)}`);
      console.log(`   Despesas: R$ ${totalExpenses.toFixed(2)}`);
      console.log(`   Resultado: R$ ${netResult.toFixed(2)}`);
      console.log(`   Saldo total: R$ ${totalBalance.toFixed(2)}`);

      return reportData;

    } catch (error) {
      console.error('❌ Erro ao gerar relatório:', error);
      throw error;
    }
  }

  private groupTransactionsByPeriod(transactions: Transaction[], period: 'daily' | 'weekly' | 'monthly' | 'yearly') {
    const grouped: { [key: string]: { income: number; expenses: number; net: number } } = {};

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      let key: string;

      switch (period) {
        case 'daily':
          key = date.toISOString().split('T')[0]; // YYYY-MM-DD
          break;
        case 'weekly':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split('T')[0];
          break;
        case 'monthly':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        case 'yearly':
          key = date.getFullYear().toString();
          break;
        default:
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }

      if (!grouped[key]) {
        grouped[key] = { income: 0, expenses: 0, net: 0 };
      }

      const amount = parseFloat(transaction.amount.toString());
      if (transaction.type === 'income') {
        grouped[key].income += amount;
      } else {
        grouped[key].expenses += amount;
      }
      grouped[key].net = grouped[key].income - grouped[key].expenses;
    });

    return grouped;
  }

  async getCashFlowReport(userId: string, filters: {
    startDate?: string;
    endDate?: string;
    period?: 'daily' | 'weekly' | 'monthly';
    regime?: 'cash' | 'accrual';
    considerUnpaid?: boolean;
  }) {
    const { startDate, endDate, period = 'monthly', regime = 'cash', considerUnpaid = false } = filters;

    // Definir datas padrão se não fornecidas
    const defaultStartDate = startDate || new Date(new Date().getFullYear(), 0, 1).toISOString();
    const defaultEndDate = endDate || new Date().toISOString();

    console.log(`💰 Gerando relatório de fluxo de caixa para usuário ${userId}`);
    console.log(`   Período: ${defaultStartDate} a ${defaultEndDate}`);

    try {
      // Buscar transações do usuário no período
      const queryBuilder = this.transactionRepository
        .createQueryBuilder('transaction')
        .leftJoin('transaction.account', 'account')
        .where('account.userId = :userId', { userId })
        .andWhere('transaction.date >= :startDate', { startDate: defaultStartDate })
        .andWhere('transaction.date <= :endDate', { endDate: defaultEndDate });

      // Filtrar por status se regime for 
      // 'cash' e não considerar não pagos
      if (regime === 'cash' && !considerUnpaid) {
        queryBuilder.andWhere('transaction.status = :status', { status: 'completed' });
      }

      const transactions = await queryBuilder.getMany();

      // Buscar saldos das contas
      const accounts = await this.accountRepository.find({ where: { userId } });
      const totalBalance = accounts.reduce((sum, account) => sum + parseFloat(account.balance.toString()), 0);

      // Agrupar por período
      const groupedData = this.groupTransactionsByPeriod(transactions, period);

      // Calcular fluxo de caixa acumulado
      const cashFlowData = this.calculateCashFlow(groupedData, totalBalance);

      const reportData = {
        summary: {
          totalBalance,
          totalIncome: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0),
          totalExpenses: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0),
          transactionCount: transactions.length
        },
        cashFlowData,
        dateRange: {
          startDate: defaultStartDate,
          endDate: defaultEndDate
        },
        filters: {
          period,
          regime,
          considerUnpaid
        }
      };

      console.log(`✅ Relatório de fluxo de caixa gerado com sucesso`);
      return reportData;

    } catch (error) {
      console.error('❌ Erro ao gerar relatório de fluxo de caixa:', error);
      throw error;
    }
  }

  async getCategoryAnalysis(userId: string, filters: {
    startDate?: string;
    endDate?: string;
    period?: 'daily' | 'weekly' | 'monthly';
    regime?: 'cash' | 'accrual';
    considerUnpaid?: boolean;
    categoryId?: string;
    accountId?: string;
  }) {
    const { startDate, endDate, period = 'monthly', regime = 'cash', considerUnpaid = false, categoryId, accountId } = filters;

    // Definir datas padrão se não fornecidas
    const defaultStartDate = startDate || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    const defaultEndDate = endDate || new Date().toISOString();

    console.log(`📊 Gerando análise por categorias para usuário ${userId}`);

    try {
      // Buscar transações do usuário no período
      const queryBuilder = this.transactionRepository
        .createQueryBuilder('transaction')
        .leftJoin('transaction.account', 'account')
        .leftJoin('transaction.category', 'category')
        .where('account.userId = :userId', { userId })
        .andWhere('transaction.date >= :startDate', { startDate: defaultStartDate })
        .andWhere('transaction.date <= :endDate', { endDate: defaultEndDate });

      // Filtrar por status se regime for 'cash' e não considerar não pagos
      if (regime === 'cash' && !considerUnpaid) {
        queryBuilder.andWhere('transaction.status = :status', { status: 'completed' });
      }

      // Filtrar por categoria específica se fornecida
      if (categoryId) {
        queryBuilder.andWhere('transaction.categoryId = :categoryId', { categoryId });
      }

      // Filtrar por conta específica se fornecida
      if (accountId) {
        queryBuilder.andWhere('transaction.accountId = :accountId', { accountId });
      }

      const transactions = await queryBuilder.getMany();

      // Agrupar por categoria
      const categoryData = this.groupTransactionsByCategory(transactions);

      // Separar receitas e despesas por categoria
      const incomeByCategory = categoryData.filter(cat => cat.type === 'income');
      const expenseByCategory = categoryData.filter(cat => cat.type === 'expense');

      const reportData = {
        summary: {
          totalIncome: incomeByCategory.reduce((sum, cat) => sum + cat.total, 0),
          totalExpenses: expenseByCategory.reduce((sum, cat) => sum + cat.total, 0),
          transactionCount: transactions.length
        },
        incomeByCategory,
        expenseByCategory,
        dateRange: {
          startDate: defaultStartDate,
          endDate: defaultEndDate
        },
        filters: {
          period,
          regime,
          considerUnpaid,
          categoryId,
          accountId
        }
      };

      console.log(`✅ Análise por categorias gerada com sucesso`);
      return reportData;

    } catch (error) {
      console.error('❌ Erro ao gerar análise por categorias:', error);
      throw error;
    }
  }

  async getBankAccountAnalysis(userId: string, filters: {
    startDate?: string;
    endDate?: string;
    period?: 'daily' | 'weekly' | 'monthly';
    regime?: 'cash' | 'accrual';
    considerUnpaid?: boolean;
  }) {
    const { startDate, endDate, period = 'monthly', regime = 'cash', considerUnpaid = false } = filters;

    // Definir datas padrão se não fornecidas
    const defaultStartDate = startDate || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    const defaultEndDate = endDate || new Date().toISOString();

    console.log(`🏦 Gerando análise por contas bancárias para usuário ${userId}`);

    try {
      // Buscar contas do usuário
      const accounts = await this.accountRepository.find({ where: { userId } });

      // Buscar transações do usuário no período
      const queryBuilder = this.transactionRepository
        .createQueryBuilder('transaction')
        .leftJoin('transaction.account', 'account')
        .where('account.userId = :userId', { userId })
        .andWhere('transaction.date >= :startDate', { startDate: defaultStartDate })
        .andWhere('transaction.date <= :endDate', { endDate: defaultEndDate });

      // Filtrar por status se regime for 'cash' e não considerar não pagos
      if (regime === 'cash' && !considerUnpaid) {
        queryBuilder.andWhere('transaction.status = :status', { status: 'completed' });
      }

      const transactions = await queryBuilder.getMany();

      // Agrupar por conta
      const accountData = this.groupTransactionsByAccount(transactions, accounts);

      const reportData = {
        summary: {
          totalBalance: accounts.reduce((sum, account) => sum + parseFloat(account.balance.toString()), 0),
          totalIncome: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0),
          totalExpenses: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0),
          transactionCount: transactions.length
        },
        accountData,
        dateRange: {
          startDate: defaultStartDate,
          endDate: defaultEndDate
        },
        filters: {
          period,
          regime,
          considerUnpaid
        }
      };

      console.log(`✅ Análise por contas bancárias gerada com sucesso`);
      return reportData;

    } catch (error) {
      console.error('❌ Erro ao gerar análise por contas bancárias:', error);
      throw error;
    }
  }

  private calculateCashFlow(groupedData: { [key: string]: { income: number; expenses: number; net: number } }, initialBalance: number) {
    const cashFlowData: { [key: string]: { income: number; expenses: number; net: number; balance: number } } = {};
    let runningBalance = initialBalance;

    // Ordenar períodos
    const sortedPeriods = Object.keys(groupedData).sort();

    sortedPeriods.forEach(period => {
      const data = groupedData[period];
      runningBalance += data.net;

      cashFlowData[period] = {
        income: data.income,
        expenses: data.expenses,
        net: data.net,
        balance: runningBalance
      };
    });

    return cashFlowData;
  }

  private groupTransactionsByCategory(transactions: Transaction[]) {
    const categoryMap = new Map<string, {
      categoryId: string;
      categoryName: string;
      type: string;
      total: number;
      transactionCount: number;
      color?: string;
    }>();

    transactions.forEach(transaction => {
      const categoryId = transaction.categoryId || 'uncategorized';
      const categoryName = transaction.category?.name || 'Sem categoria';
      const key = `${categoryId}-${transaction.type}`;

      if (!categoryMap.has(key)) {
        categoryMap.set(key, {
          categoryId,
          categoryName,
          type: transaction.type,
          total: 0,
          transactionCount: 0,
          color: transaction.category?.color
        });
      }

      const categoryData = categoryMap.get(key)!;
      categoryData.total += parseFloat(transaction.amount.toString());
      categoryData.transactionCount += 1;
    });

    return Array.from(categoryMap.values()).sort((a, b) => b.total - a.total);
  }

  private groupTransactionsByAccount(transactions: Transaction[], accounts: Account[]) {
    const accountMap = new Map<string, {
      accountId: string;
      accountName: string;
      balance: number;
      income: number;
      expenses: number;
      net: number;
      transactionCount: number;
      color?: string;
    }>();

    // Inicializar com todas as contas
    accounts.forEach(account => {
      accountMap.set(account.id, {
        accountId: account.id,
        accountName: account.name,
        balance: parseFloat(account.balance.toString()),
        income: 0,
        expenses: 0,
        net: 0,
        transactionCount: 0,
        color: account.color
      });
    });

    // Processar transações
    transactions.forEach(transaction => {
      const accountData = accountMap.get(transaction.accountId);
      if (accountData) {
        const amount = parseFloat(transaction.amount.toString());

        if (transaction.type === 'income') {
          accountData.income += amount;
        } else if (transaction.type === 'expense') {
          accountData.expenses += amount;
        }

        accountData.net = accountData.income - accountData.expenses;
        accountData.transactionCount += 1;
      }
    });

    return Array.from(accountMap.values()).sort((a, b) => b.balance - a.balance);
  }

  async getIncomeStatement(userId: string, filters: {
    startDate?: string;
    endDate?: string;
    period?: 'daily' | 'weekly' | 'monthly';
    regime?: 'cash' | 'accrual';
    considerUnpaid?: boolean;
  }) {
    const { startDate, endDate, period = 'monthly', regime = 'cash', considerUnpaid = false } = filters;

    // Definir datas padrão se não fornecidas
    const defaultStartDate = startDate || new Date(new Date().getFullYear(), 0, 1).toISOString();
    const defaultEndDate = endDate || new Date().toISOString();

    console.log(`📈 Gerando DRE Gerencial para usuário ${userId}`);

    try {
      // Buscar transações do usuário no período
      const queryBuilder = this.transactionRepository
        .createQueryBuilder('transaction')
        .leftJoin('transaction.account', 'account')
        .leftJoin('transaction.category', 'category')
        .where('account.userId = :userId', { userId })
        .andWhere('transaction.date >= :startDate', { startDate: defaultStartDate })
        .andWhere('transaction.date <= :endDate', { endDate: defaultEndDate });

      // Filtrar por status se regime for 'cash' e não considerar não pagos
      if (regime === 'cash' && !considerUnpaid) {
        queryBuilder.andWhere('transaction.status = :status', { status: 'completed' });
      }

      const transactions = await queryBuilder.getMany();

      // Agrupar por período para DRE
      const groupedData = this.groupTransactionsByPeriod(transactions, period);

      // Calcular DRE por categoria
      const dreData = this.calculateIncomeStatement(transactions, groupedData);

      const reportData = {
        summary: {
          totalIncome: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0),
          totalExpenses: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0),
          netResult: 0, // Será calculado no frontend
          transactionCount: transactions.length
        },
        dreData,
        periodData: groupedData,
        dateRange: {
          startDate: defaultStartDate,
          endDate: defaultEndDate
        },
        filters: {
          period,
          regime,
          considerUnpaid
        }
      };

      console.log(`✅ DRE Gerencial gerado com sucesso`);
      return reportData;

    } catch (error) {
      console.error('❌ Erro ao gerar DRE Gerencial:', error);
      throw error;
    }
  }

  private calculateIncomeStatement(transactions: Transaction[], groupedData: { [key: string]: { income: number; expenses: number; net: number } }) {
    // Agrupar transações por categoria para DRE
    const categoryMap = new Map<string, {
      categoryName: string;
      type: string;
      total: number;
      color?: string;
      periodValues: { [key: string]: number };
    }>();

    // Inicializar com categorias conhecidas para DRE
    const dreCategories = [
      { name: 'Receitas operacionais', type: 'income', color: 'green' },
      { name: 'Deduções das receitas', type: 'expense', color: 'red' },
      { name: 'Receita líquida', type: 'net', color: 'blue' },
      { name: 'Custos variáveis', type: 'expense', color: 'red' },
      { name: 'Margem de contribuição', type: 'net', color: 'blue' },
      { name: 'Despesas operacionais', type: 'expense', color: 'red' },
      { name: 'Resultado operacional', type: 'net', color: 'blue' }
    ];

    dreCategories.forEach(category => {
      categoryMap.set(category.name, {
        categoryName: category.name,
        type: category.type,
        total: 0,
        color: category.color,
        periodValues: {}
      });
    });

    // Processar transações reais
    transactions.forEach(transaction => {
      const categoryName = transaction.category?.name || 'Outros';
      const amount = parseFloat(transaction.amount.toString());
      const periodKey = this.getPeriodKey(transaction.date, 'monthly');

      // Mapear categorias reais para categorias do DRE
      let dreCategory = 'Outros';
      if (transaction.type === 'income') {
        dreCategory = 'Receitas operacionais';
      } else if (transaction.type === 'expense') {
        if (categoryName.toLowerCase().includes('custo') || categoryName.toLowerCase().includes('material')) {
          dreCategory = 'Custos variáveis';
        } else {
          dreCategory = 'Despesas operacionais';
        }
      }

      const categoryData = categoryMap.get(dreCategory);
      if (categoryData) {
        categoryData.total += amount;
        if (!categoryData.periodValues[periodKey]) {
          categoryData.periodValues[periodKey] = 0;
        }
        categoryData.periodValues[periodKey] += amount;
      }
    });

    // Calcular valores derivados
    const receitasOperacionais = categoryMap.get('Receitas operacionais')?.total || 0;
    const deducoesReceitas = categoryMap.get('Deduções das receitas')?.total || 0;
    const custosVariaveis = categoryMap.get('Custos variáveis')?.total || 0;
    const despesasOperacionais = categoryMap.get('Despesas operacionais')?.total || 0;

    // Receita líquida
    const receitaLiquida = receitasOperacionais - deducoesReceitas;
    const receitaLiquidaData = categoryMap.get('Receita líquida');
    if (receitaLiquidaData) {
      receitaLiquidaData.total = receitaLiquida;
    }

    // Margem de contribuição
    const margemContribuicao = receitaLiquida - custosVariaveis;
    const margemContribuicaoData = categoryMap.get('Margem de contribuição');
    if (margemContribuicaoData) {
      margemContribuicaoData.total = margemContribuicao;
    }

    // Resultado operacional
    const resultadoOperacional = margemContribuicao - despesasOperacionais;
    const resultadoOperacionalData = categoryMap.get('Resultado operacional');
    if (resultadoOperacionalData) {
      resultadoOperacionalData.total = resultadoOperacional;
    }

    return Array.from(categoryMap.values()).map(category => ({
      category: category.categoryName,
      color: category.color,
      items: [{
        name: category.categoryName,
        values: Object.keys(groupedData).map(periodKey => {
          const value = category.periodValues[periodKey] || 0;
          return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(value);
        })
      }]
    }));
  }

  // ===== ADVANCED ANALYTICS =====

  async getAdvancedAnalytics(userId: string, filters: {
    startDate?: string;
    endDate?: string;
    period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    includeForecast?: boolean;
  }) {
    const { startDate, endDate, period = 'monthly', includeForecast = false } = filters;

    const defaultStartDate = startDate || new Date(new Date().getFullYear() - 1, 0, 1).toISOString();
    const defaultEndDate = endDate || new Date().toISOString();

    this.logger.log(`📈 Gerando análise avançada para usuário ${userId}`);

    try {
      // Buscar dados históricos
      const transactions = await this.transactionRepository
        .createQueryBuilder('transaction')
        .leftJoin('transaction.account', 'account')
        .leftJoin('transaction.category', 'category')
        .where('account.userId = :userId', { userId })
        .andWhere('transaction.date >= :startDate', { startDate: defaultStartDate })
        .andWhere('transaction.date <= :endDate', { endDate: defaultEndDate })
        .andWhere('transaction.status = :status', { status: 'completed' })
        .getMany();

      // Análise de tendências
      const trendAnalysis = this.analyzeTrends(transactions, period);

      // Análise de sazonalidade
      const seasonalityAnalysis = this.analyzeSeasonality(transactions);

      // Análise de volatilidade
      const volatilityAnalysis = this.analyzeVolatility(transactions, period);

      // Análise de correlações
      const correlationAnalysis = await this.analyzeCorrelations(userId, transactions);

      // Previsões (se solicitado)
      const forecast = includeForecast ? this.generateForecast(trendAnalysis, seasonalityAnalysis) : null;

      return {
        trendAnalysis,
        seasonalityAnalysis,
        volatilityAnalysis,
        correlationAnalysis,
        forecast,
        summary: {
          totalTransactions: transactions.length,
          totalAmount: transactions.reduce((sum, t) => sum + Number(t.amount), 0),
          averageTransaction: transactions.length > 0 ? transactions.reduce((sum, t) => sum + Number(t.amount), 0) / transactions.length : 0,
          period: period,
          dateRange: { start: defaultStartDate, end: defaultEndDate }
        }
      };
    } catch (error) {
      this.logger.error(`Erro ao gerar análise avançada:`, error);
      throw error;
    }
  }

  async getCashFlowProjection(userId: string, months: number = 12) {
    this.logger.log(`💰 Gerando projeção de fluxo de caixa para ${months} meses`);

    try {
      // Buscar transações dos últimos 12 meses para análise
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(endDate.getMonth() - 12);

      const transactions = await this.transactionRepository
        .createQueryBuilder('transaction')
        .leftJoin('transaction.account', 'account')
        .leftJoin('transaction.category', 'category')
        .where('account.userId = :userId', { userId })
        .andWhere('transaction.date >= :startDate', { startDate: startDate.toISOString() })
        .andWhere('transaction.date <= :endDate', { endDate: endDate.toISOString() })
        .andWhere('transaction.status = :status', { status: 'completed' })
        .getMany();

      // Buscar contas para saldo atual
      const accounts = await this.accountRepository.find({
        where: { userId, isActive: true }
      });

      const currentBalance = accounts.reduce((sum, account) => sum + Number(account.balance), 0);

      // Análise de padrões mensais
      const monthlyPatterns = this.analyzeMonthlyPatterns(transactions);

      // Projeção de receitas
      const revenueProjection = this.projectRevenues(monthlyPatterns.revenues, months);

      // Projeção de despesas
      const expenseProjection = this.projectExpenses(monthlyPatterns.expenses, months);

      // Projeção de fluxo de caixa
      const cashFlowProjection = this.projectCashFlow(currentBalance, revenueProjection, expenseProjection);

      return {
        currentBalance,
        monthlyPatterns,
        projections: {
          revenues: revenueProjection,
          expenses: expenseProjection,
          cashFlow: cashFlowProjection
        },
        scenarios: {
          optimistic: this.generateOptimisticScenario(cashFlowProjection),
          realistic: this.generateRealisticScenario(cashFlowProjection),
          pessimistic: this.generatePessimisticScenario(cashFlowProjection)
        }
      };
    } catch (error) {
      this.logger.error(`Erro ao gerar projeção de fluxo de caixa:`, error);
      throw error;
    }
  }

  async getCreditCardAnalysis(userId: string, filters: {
    startDate?: string;
    endDate?: string;
    cardIds?: string[];
  }) {
    const { startDate, endDate, cardIds } = filters;

    const defaultStartDate = startDate || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    const defaultEndDate = endDate || new Date().toISOString();

    this.logger.log(`💳 Gerando análise de cartões de crédito para usuário ${userId}`);

    try {
      // Buscar cartões do usuário
      const creditCards = await this.creditCardRepository.find({
        where: { userId, isActive: true }
      });

      const filteredCards = cardIds ? creditCards.filter(card => cardIds.includes(card.id)) : creditCards;

      // Buscar transações dos cartões
      const transactions = await this.transactionRepository
        .createQueryBuilder('transaction')
        .leftJoin('transaction.creditCard', 'creditCard')
        .leftJoin('transaction.category', 'category')
        .where('creditCard.userId = :userId', { userId })
        .andWhere('transaction.date >= :startDate', { startDate: defaultStartDate })
        .andWhere('transaction.date <= :endDate', { endDate: defaultEndDate })
        .andWhere('transaction.status = :status', { status: 'completed' })
        .getMany();

      // Análise por cartão
      const cardAnalysis = filteredCards.map(card => {
        const cardTransactions = transactions.filter(t => t.creditCard?.id === card.id);
        const totalSpent = cardTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
        const utilizationRate = Number(card.creditLimit) > 0 ? (Number(card.currentBalance) / Number(card.creditLimit)) * 100 : 0;

        return {
          cardId: card.id,
          cardName: card.name,
          brand: card.brand,
          creditLimit: Number(card.creditLimit),
          currentBalance: Number(card.currentBalance),
          availableLimit: Number(card.availableLimit),
          utilizationRate,
          totalSpent,
          transactionCount: cardTransactions.length,
          averageTransaction: cardTransactions.length > 0 ? totalSpent / cardTransactions.length : 0,
          interestRate: Number(card.interestRate),
          annualFee: Number(card.annualFee)
        };
      });

      // Análise por categoria
      const categoryAnalysis = this.analyzeCreditCardCategories(transactions);

      // Análise de padrões de gastos
      const spendingPatterns = this.analyzeSpendingPatterns(transactions);

      // Análise de risco
      const riskAnalysis = this.analyzeCreditRisk(cardAnalysis);

      return {
        cards: cardAnalysis,
        categoryAnalysis,
        spendingPatterns,
        riskAnalysis,
        summary: {
          totalCards: filteredCards.length,
          totalCreditLimit: cardAnalysis.reduce((sum, card) => sum + card.creditLimit, 0),
          totalCurrentBalance: cardAnalysis.reduce((sum, card) => sum + card.currentBalance, 0),
          totalSpent: cardAnalysis.reduce((sum, card) => sum + card.totalSpent, 0),
          averageUtilizationRate: cardAnalysis.length > 0 ? cardAnalysis.reduce((sum, card) => sum + card.utilizationRate, 0) / cardAnalysis.length : 0
        }
      };
    } catch (error) {
      this.logger.error(`Erro ao gerar análise de cartões:`, error);
      throw error;
    }
  }

  async getContactAnalysis(userId: string, filters: {
    startDate?: string;
    endDate?: string;
    contactIds?: string[];
  }) {
    const { startDate, endDate, contactIds } = filters;

    const defaultStartDate = startDate || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    const defaultEndDate = endDate || new Date().toISOString();

    this.logger.log(`👥 Gerando análise de contatos para usuário ${userId}`);

    try {
      // Buscar contatos do usuário
      const contacts = await this.contactRepository.find({
        where: { userId, isActive: true }
      });

      const filteredContacts = contactIds ? contacts.filter(contact => contactIds.includes(contact.id)) : contacts;

      // Buscar transações relacionadas aos contatos
      const transactions = await this.transactionRepository
        .createQueryBuilder('transaction')
        .leftJoin('transaction.contact', 'contact')
        .leftJoin('transaction.category', 'category')
        .where('contact.userId = :userId', { userId })
        .andWhere('transaction.date >= :startDate', { startDate: defaultStartDate })
        .andWhere('transaction.date <= :endDate', { endDate: defaultEndDate })
        .andWhere('transaction.status = :status', { status: 'completed' })
        .getMany();

      // Análise por contato
      const contactAnalysis = filteredContacts.map(contact => {
        const contactTransactions = transactions.filter(t => t.contact?.id === contact.id);
        const totalAmount = contactTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
        const incomeTransactions = contactTransactions.filter(t => t.type === 'income');
        const expenseTransactions = contactTransactions.filter(t => t.type === 'expense');

        const totalIncome = incomeTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
        const totalExpense = expenseTransactions.reduce((sum, t) => sum + Number(t.amount), 0);

        return {
          contactId: contact.id,
          contactName: contact.name,
          email: contact.email,
          phone: contact.phone,
          totalTransactions: contactTransactions.length,
          totalAmount,
          totalIncome,
          totalExpense,
          netAmount: totalIncome - totalExpense,
          averageTransaction: contactTransactions.length > 0 ? totalAmount / contactTransactions.length : 0,
          lastTransactionDate: contactTransactions.length > 0 ?
            Math.max(...contactTransactions.map(t => new Date(t.date).getTime())) : null
        };
      });

      // Análise de padrões
      const patterns = this.analyzeContactPatterns(contactAnalysis);

      // Análise de segmentação
      const segmentation = this.segmentContacts(contactAnalysis);

      return {
        contacts: contactAnalysis,
        patterns,
        segmentation,
        summary: {
          totalContacts: filteredContacts.length,
          totalTransactions: transactions.length,
          totalAmount: contactAnalysis.reduce((sum, contact) => sum + contact.totalAmount, 0),
          averagePerContact: filteredContacts.length > 0 ?
            contactAnalysis.reduce((sum, contact) => sum + contact.totalAmount, 0) / filteredContacts.length : 0
        }
      };
    } catch (error) {
      this.logger.error(`Erro ao gerar análise de contatos:`, error);
      throw error;
    }
  }

  // ===== PRIVATE HELPER METHODS =====

  private analyzeTrends(transactions: Transaction[], period: 'daily' | 'weekly' | 'monthly' | 'yearly') {
    const grouped = this.groupTransactionsByPeriod(transactions, period);
    const periods = Object.keys(grouped).sort();

    const trends = {
      revenue: this.calculateTrend(grouped, periods, 'income'),
      expense: this.calculateTrend(grouped, periods, 'expenses'),
      net: this.calculateTrend(grouped, periods, 'net')
    };

    return trends;
  }

  private analyzeSeasonality(transactions: Transaction[]) {
    const monthlyData = new Map();

    transactions.forEach(transaction => {
      const month = new Date(transaction.date).getMonth();
      const type = transaction.type;

      if (!monthlyData.has(month)) {
        monthlyData.set(month, { income: 0, expense: 0, count: 0 });
      }

      const data = monthlyData.get(month);
      data[type] += Number(transaction.amount);
      data.count++;
    });

    return Array.from(monthlyData.entries()).map(([month, data]) => ({
      month: month + 1,
      monthName: new Date(0, month).toLocaleString('pt-BR', { month: 'long' }),
      income: data.income,
      expense: data.expense,
      net: data.income - data.expense,
      averageTransaction: data.count > 0 ? (data.income + data.expense) / data.count : 0
    }));
  }

  private analyzeVolatility(transactions: Transaction[], period: 'daily' | 'weekly' | 'monthly' | 'yearly') {
    const grouped = this.groupTransactionsByPeriod(transactions, period);
    const periods = Object.keys(grouped).sort();

    const revenues = periods.map(p => grouped[p].income || 0);
    const expenses = periods.map(p => grouped[p].expenses || 0);

    return {
      revenueVolatility: this.calculateVolatility(revenues),
      expenseVolatility: this.calculateVolatility(expenses),
      netVolatility: this.calculateVolatility(revenues.map((r, i) => r - expenses[i]))
    };
  }

  private async analyzeCorrelations(userId: string, transactions: Transaction[]) {
    // Análise de correlação entre categorias
    const categoryCorrelations = this.calculateCategoryCorrelations(transactions);

    // Análise de correlação temporal
    const temporalCorrelations = this.calculateTemporalCorrelations(transactions);

    return {
      categoryCorrelations,
      temporalCorrelations
    };
  }

  private generateForecast(trendAnalysis: any, seasonalityAnalysis: any[]) {
    // Implementação simplificada de previsão
    const forecastPeriods = 6; // Próximos 6 períodos
    const forecast = [];

    for (let i = 1; i <= forecastPeriods; i++) {
      const baseValue = trendAnalysis.net.slope * i + trendAnalysis.net.intercept;
      const seasonalAdjustment = seasonalityAnalysis[i % 12]?.net || 0;

      forecast.push({
        period: i,
        predictedValue: baseValue + seasonalAdjustment,
        confidence: Math.max(0.5, 1 - (i * 0.1)) // Diminui confiança com o tempo
      });
    }

    return forecast;
  }

  private analyzeMonthlyPatterns(transactions: Transaction[]) {
    const monthlyData = new Map();

    transactions.forEach(transaction => {
      const month = new Date(transaction.date).getMonth();
      const type = transaction.type;

      if (!monthlyData.has(month)) {
        monthlyData.set(month, { income: 0, expense: 0, count: 0 });
      }

      const data = monthlyData.get(month);
      data[type] += Number(transaction.amount);
      data.count++;
    });

    return {
      revenues: Array.from(monthlyData.values()).map(data => data.income),
      expenses: Array.from(monthlyData.values()).map(data => data.expense),
      counts: Array.from(monthlyData.values()).map(data => data.count)
    };
  }

  private projectRevenues(revenues: number[], months: number) {
    const avgRevenue = revenues.reduce((sum, r) => sum + r, 0) / revenues.length;
    const trend = this.calculateSimpleTrend(revenues);

    return Array.from({ length: months }, (_, i) => ({
      month: i + 1,
      projected: avgRevenue + (trend * i),
      confidence: Math.max(0.6, 1 - (i * 0.05))
    }));
  }

  private projectExpenses(expenses: number[], months: number) {
    const avgExpense = expenses.reduce((sum, e) => sum + e, 0) / expenses.length;
    const trend = this.calculateSimpleTrend(expenses);

    return Array.from({ length: months }, (_, i) => ({
      month: i + 1,
      projected: avgExpense + (trend * i),
      confidence: Math.max(0.6, 1 - (i * 0.05))
    }));
  }

  private projectCashFlow(currentBalance: number, revenueProjection: any[], expenseProjection: any[]) {
    let runningBalance = currentBalance;

    return revenueProjection.map((revenue, i) => {
      const netCashFlow = revenue.projected - expenseProjection[i].projected;
      runningBalance += netCashFlow;

      return {
        month: i + 1,
        revenue: revenue.projected,
        expense: expenseProjection[i].projected,
        netCashFlow,
        projectedBalance: runningBalance,
        confidence: Math.min(revenue.confidence, expenseProjection[i].confidence)
      };
    });
  }

  private generateOptimisticScenario(cashFlowProjection: any[]) {
    return cashFlowProjection.map(projection => ({
      ...projection,
      revenue: projection.revenue * 1.1,
      expense: projection.expense * 0.95,
      netCashFlow: projection.revenue * 1.1 - projection.expense * 0.95
    }));
  }

  private generateRealisticScenario(cashFlowProjection: any[]) {
    return cashFlowProjection; // Cenário base
  }

  private generatePessimisticScenario(cashFlowProjection: any[]) {
    return cashFlowProjection.map(projection => ({
      ...projection,
      revenue: projection.revenue * 0.9,
      expense: projection.expense * 1.05,
      netCashFlow: projection.revenue * 0.9 - projection.expense * 1.05
    }));
  }

  private analyzeCreditCardCategories(transactions: Transaction[]) {
    const categoryMap = new Map();

    transactions.forEach(transaction => {
      const categoryName = transaction.category?.name || 'Sem categoria';
      if (!categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, { amount: 0, count: 0 });
      }
      const data = categoryMap.get(categoryName);
      data.amount += Number(transaction.amount);
      data.count++;
    });

    return Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      amount: data.amount,
      count: data.count,
      average: data.count > 0 ? data.amount / data.count : 0
    })).sort((a, b) => b.amount - a.amount);
  }

  private analyzeSpendingPatterns(transactions: Transaction[]) {
    const dailyPatterns = new Map();
    const weeklyPatterns = new Map();

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const dayOfWeek = date.getDay();
      const hour = date.getHours();

      // Padrão semanal
      if (!weeklyPatterns.has(dayOfWeek)) {
        weeklyPatterns.set(dayOfWeek, { amount: 0, count: 0 });
      }
      const weekData = weeklyPatterns.get(dayOfWeek);
      weekData.amount += Number(transaction.amount);
      weekData.count++;

      // Padrão diário (por hora)
      if (!dailyPatterns.has(hour)) {
        dailyPatterns.set(hour, { amount: 0, count: 0 });
      }
      const dayData = dailyPatterns.get(hour);
      dayData.amount += Number(transaction.amount);
      dayData.count++;
    });

    return {
      weekly: Array.from(weeklyPatterns.entries()).map(([day, data]) => ({
        day,
        dayName: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][day],
        amount: data.amount,
        count: data.count,
        average: data.count > 0 ? data.amount / data.count : 0
      })),
      daily: Array.from(dailyPatterns.entries()).map(([hour, data]) => ({
        hour,
        amount: data.amount,
        count: data.count,
        average: data.count > 0 ? data.amount / data.count : 0
      }))
    };
  }

  private analyzeCreditRisk(cardAnalysis: any[]) {
    const highRiskCards = cardAnalysis.filter(card => card.utilizationRate > 80);
    const mediumRiskCards = cardAnalysis.filter(card => card.utilizationRate > 50 && card.utilizationRate <= 80);
    const lowRiskCards = cardAnalysis.filter(card => card.utilizationRate <= 50);

    return {
      highRisk: {
        count: highRiskCards.length,
        cards: highRiskCards.map(card => ({ name: card.cardName, utilizationRate: card.utilizationRate }))
      },
      mediumRisk: {
        count: mediumRiskCards.length,
        cards: mediumRiskCards.map(card => ({ name: card.cardName, utilizationRate: card.utilizationRate }))
      },
      lowRisk: {
        count: lowRiskCards.length,
        cards: lowRiskCards.map(card => ({ name: card.cardName, utilizationRate: card.utilizationRate }))
      },
      overallRiskScore: this.calculateOverallRiskScore(cardAnalysis)
    };
  }

  private analyzeContactPatterns(contactAnalysis: any[]) {
    const patterns = {
      topContributors: contactAnalysis
        .filter(contact => contact.netAmount > 0)
        .sort((a, b) => b.netAmount - a.netAmount)
        .slice(0, 10),
      topReceivers: contactAnalysis
        .filter(contact => contact.netAmount < 0)
        .sort((a, b) => a.netAmount - b.netAmount)
        .slice(0, 10),
      mostActive: contactAnalysis
        .sort((a, b) => b.totalTransactions - a.totalTransactions)
        .slice(0, 10)
    };

    return patterns;
  }

  private segmentContacts(contactAnalysis: any[]) {
    const segments = {
      highValue: contactAnalysis.filter(contact => contact.totalAmount > 10000),
      mediumValue: contactAnalysis.filter(contact => contact.totalAmount > 1000 && contact.totalAmount <= 10000),
      lowValue: contactAnalysis.filter(contact => contact.totalAmount <= 1000),
      contributors: contactAnalysis.filter(contact => contact.netAmount > 0),
      receivers: contactAnalysis.filter(contact => contact.netAmount < 0),
      neutral: contactAnalysis.filter(contact => contact.netAmount === 0)
    };

    return segments;
  }

  // ===== UTILITY METHODS =====

  private calculateTrend(grouped: any, periods: string[], type: string) {
    const values = periods.map(p => grouped[p]?.[type] || 0);
    return this.calculateLinearRegression(values);
  }

  private calculateVolatility(values: number[]) {
    if (values.length < 2) return 0;

    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;

    return Math.sqrt(variance);
  }

  private calculateCategoryCorrelations(transactions: Transaction[]) {
    // Implementação simplificada de correlação entre categorias
    const categoryMap = new Map();

    transactions.forEach(transaction => {
      const categoryName = transaction.category?.name || 'Sem categoria';
      if (!categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, []);
      }
      categoryMap.get(categoryName).push(Number(transaction.amount));
    });

    // Retornar correlações básicas
    return Array.from(categoryMap.entries()).map(([category, amounts]) => ({
      category,
      averageAmount: amounts.reduce((sum, a) => sum + a, 0) / amounts.length,
      volatility: this.calculateVolatility(amounts)
    }));
  }

  private calculateTemporalCorrelations(transactions: Transaction[]) {
    // Análise de correlação temporal básica
    const monthlyData = new Map();

    transactions.forEach(transaction => {
      const month = new Date(transaction.date).getMonth();
      if (!monthlyData.has(month)) {
        monthlyData.set(month, []);
      }
      monthlyData.get(month).push(Number(transaction.amount));
    });

    return Array.from(monthlyData.entries()).map(([month, amounts]) => ({
      month: month + 1,
      totalAmount: amounts.reduce((sum, a) => sum + a, 0),
      averageAmount: amounts.reduce((sum, a) => sum + a, 0) / amounts.length,
      transactionCount: amounts.length
    }));
  }

  private calculateSimpleTrend(values: number[]) {
    if (values.length < 2) return 0;

    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = values;

    const sumX = x.reduce((sum, v) => sum + v, 0);
    const sumY = y.reduce((sum, v) => sum + v, 0);
    const sumXY = x.reduce((sum, v, i) => sum + v * y[i], 0);
    const sumXX = x.reduce((sum, v) => sum + v * v, 0);

    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  }

  private calculateLinearRegression(values: number[]) {
    if (values.length < 2) return { slope: 0, intercept: 0, r2: 0 };

    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = values;

    const sumX = x.reduce((sum, v) => sum + v, 0);
    const sumY = y.reduce((sum, v) => sum + v, 0);
    const sumXY = x.reduce((sum, v, i) => sum + v * y[i], 0);
    const sumXX = x.reduce((sum, v) => sum + v * v, 0);
    const sumYY = y.reduce((sum, v) => sum + v * v, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Cálculo do R²
    const yMean = sumY / n;
    const ssRes = y.reduce((sum, v, i) => sum + Math.pow(v - (slope * i + intercept), 2), 0);
    const ssTot = y.reduce((sum, v) => sum + Math.pow(v - yMean, 2), 0);
    const r2 = 1 - (ssRes / ssTot);

    return { slope, intercept, r2 };
  }

  private calculateOverallRiskScore(cardAnalysis: any[]) {
    if (cardAnalysis.length === 0) return 0;

    const avgUtilization = cardAnalysis.reduce((sum, card) => sum + card.utilizationRate, 0) / cardAnalysis.length;
    const highUtilizationCards = cardAnalysis.filter(card => card.utilizationRate > 80).length;
    const totalCards = cardAnalysis.length;

    // Score de 0-100, onde 100 é o maior risco
    const utilizationScore = Math.min(avgUtilization, 100);
    const concentrationScore = (highUtilizationCards / totalCards) * 100;

    return (utilizationScore + concentrationScore) / 2;
  }

  private getPeriodKey(date: Date, period: 'daily' | 'weekly' | 'monthly' | 'yearly'): string {
    const d = new Date(date);
    switch (period) {
      case 'daily':
        return d.toISOString().split('T')[0];
      case 'weekly':
        const weekStart = new Date(d);
        weekStart.setDate(d.getDate() - d.getDay());
        return weekStart.toISOString().split('T')[0];
      case 'monthly':
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      case 'yearly':
        return d.getFullYear().toString();
      default:
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    }
  }
} 