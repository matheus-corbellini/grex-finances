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
  ) {}

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

  async getCashFlowReport(userId: string, filters: any) {
    // TODO: Implementar relatório de fluxo de caixa
    return { message: 'Relatório de fluxo de caixa em desenvolvimento' };
  }

  async getCategoryAnalysis(userId: string, filters: any) {
    // TODO: Implementar análise por categorias
    return { message: 'Análise por categorias em desenvolvimento' };
  }

  async getBankAccountAnalysis(userId: string, filters: any) {
    // TODO: Implementar análise por contas bancárias
    return { message: 'Análise por contas bancárias em desenvolvimento' };
  }
} 