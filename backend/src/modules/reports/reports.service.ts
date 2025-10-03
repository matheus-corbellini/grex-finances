import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transaction } from "../transactions/entities/transaction.entity";
import { Account } from "../accounts/entities/account.entity";

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
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

  private groupTransactionsByPeriod(transactions: Transaction[], period: 'daily' | 'weekly' | 'monthly') {
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

      // Filtrar por status se regime for 'cash' e não considerar não pagos
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

  private getPeriodKey(date: Date, period: 'daily' | 'weekly' | 'monthly'): string {
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
      default:
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    }
  }
} 