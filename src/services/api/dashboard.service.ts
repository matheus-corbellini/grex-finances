import BaseApiService from "./base.service";
import { Account } from "../../../shared/types/account.types";
import { Transaction } from "../../../shared/types/transaction.types";
import accountsService from "./accounts.service";
import transactionsService from "./transactions.service";

export interface DashboardSummary {
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    monthlyResult: number;
    accountsCount: number;
}

export interface CashFlowData {
    date: string;
    positive: number;
    negative: number;
    flow: number;
}

export interface TopExpense {
    position: number;
    name: string;
    amount: number;
    percentage: string;
}

export interface BillsSummary {
    billsToPay: {
        count: number;
        amount: number;
    };
    billsToReceive: {
        count: number;
        amount: number;
    };
}

export interface CreditCardSummary {
    name: string;
    limit: number;
    used: number;
    available: number;
}

export interface DashboardData {
    summary: DashboardSummary;
    accounts: Account[];
    cashFlowData: CashFlowData[];
    topExpenses: TopExpense[];
    billsSummary: BillsSummary;
    creditCards: CreditCardSummary[];
}

class DashboardService extends BaseApiService {
    constructor() {
        super();
    }

    async getDashboardData(period: 'week' | 'month' = 'month'): Promise<DashboardData> {
        try {
            // Calcular datas baseadas no período
            const now = new Date();
            const startDate = period === 'week'
                ? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                : new Date(now.getFullYear(), now.getMonth(), 1);
            const endDate = period === 'week'
                ? now
                : new Date(now.getFullYear(), now.getMonth() + 1, 0);

            // Buscar dados em paralelo usando serviços existentes
            const [accounts, transactions] = await Promise.all([
                accountsService.getAccounts(),
                transactionsService.getTransactions({
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                    page: 1,
                    limit: 1000 // Buscar mais transações para análise
                })
            ]);


            // Calcular dados agregados
            const summary = this.calculateSummary(accounts, transactions.data);
            const cashFlowData = this.generateCashFlowData(transactions.data, period);
            const topExpenses = this.calculateTopExpenses(transactions.data);
            const billsSummary = this.calculateBillsSummary(transactions.data);
            const creditCards = this.filterCreditCards(accounts);

            // Se não há dados suficientes, criar dados de exemplo
            const finalData = {
                summary: summary.totalBalance === 0 && summary.monthlyIncome === 0 && summary.monthlyExpenses === 0
                    ? this.createExampleSummary(accounts)
                    : summary,
                accounts,
                cashFlowData: cashFlowData.length === 0
                    ? this.createExampleCashFlowData(period)
                    : cashFlowData,
                topExpenses: topExpenses.length === 0
                    ? this.createExampleTopExpenses()
                    : topExpenses,
                billsSummary: billsSummary.billsToPay.count === 0 && billsSummary.billsToReceive.count === 0
                    ? this.createExampleBillsSummary()
                    : billsSummary,
                creditCards: creditCards.length === 0
                    ? this.createExampleCreditCards()
                    : creditCards
            };

            return finalData;
        } catch (error) {
            console.error('Erro ao carregar dados do dashboard:', error);
            throw error;
        }
    }

    private calculateSummary(accounts: Account[], transactions: Transaction[]): DashboardSummary {
        // Garantir que accounts seja um array válido
        const validAccounts = Array.isArray(accounts) ? accounts : [];

        // Calcular saldo total com validação
        const totalBalance = validAccounts.reduce((sum, account) => {
            let balance = 0;
            if (typeof account.balance === 'number') {
                balance = account.balance;
            } else if (typeof account.balance === 'string') {
                balance = parseFloat(account.balance);
            }
            return sum + (isNaN(balance) ? 0 : balance);
        }, 0);

        // Garantir que transactions seja um array válido
        const validTransactions = Array.isArray(transactions) ? transactions : [];

        const monthlyIncome = validTransactions
            .filter(t => t && (t.type === 'income' || t.type === 'INCOME') && t.amount)
            .reduce((sum, t) => {
                const amount = typeof t.amount === 'number' ? t.amount : parseFloat(t.amount);
                return sum + (isNaN(amount) ? 0 : Math.abs(amount));
            }, 0);

        const monthlyExpenses = validTransactions
            .filter(t => t && (t.type === 'expense' || t.type === 'EXPENSE') && t.amount)
            .reduce((sum, t) => {
                const amount = typeof t.amount === 'number' ? t.amount : parseFloat(t.amount);
                return sum + (isNaN(amount) ? 0 : Math.abs(amount));
            }, 0);

        const monthlyResult = monthlyIncome - monthlyExpenses;

        return {
            totalBalance: isNaN(totalBalance) ? 0 : totalBalance,
            monthlyIncome: isNaN(monthlyIncome) ? 0 : monthlyIncome,
            monthlyExpenses: isNaN(monthlyExpenses) ? 0 : monthlyExpenses,
            monthlyResult: isNaN(monthlyResult) ? 0 : monthlyResult,
            accountsCount: validAccounts.length
        };
    }

    private generateCashFlowData(transactions: Transaction[], period: 'week' | 'month'): CashFlowData[] {
        const days = period === 'week' ? 7 : 30;
        const data: CashFlowData[] = [];
        let cumulativeBalance = 0; // Saldo acumulado

        // Garantir que transactions seja um array válido
        const validTransactions = Array.isArray(transactions) ? transactions : [];

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);

            // Validar se a data é válida
            if (isNaN(date.getTime())) {
                continue;
            }

            const dayTransactions = validTransactions.filter(t => {
                if (!t || !t.date) return false;

                try {
                    const tDate = new Date(t.date);
                    // Verificar se a data é válida
                    if (isNaN(tDate.getTime())) return false;

                    return tDate.toDateString() === date.toDateString();
                } catch (error) {
                    return false;
                }
            });

            const positive = dayTransactions
                .filter(t => t && (t.type === 'income' || t.type === 'INCOME') && t.amount)
                .reduce((sum, t) => {
                    const amount = typeof t.amount === 'number' ? t.amount : parseFloat(t.amount);
                    return sum + (isNaN(amount) ? 0 : Math.abs(amount));
                }, 0);

            const negative = dayTransactions
                .filter(t => t && (t.type === 'expense' || t.type === 'EXPENSE') && t.amount)
                .reduce((sum, t) => {
                    const amount = typeof t.amount === 'number' ? t.amount : parseFloat(t.amount);
                    return sum + (isNaN(amount) ? 0 : Math.abs(amount));
                }, 0);

            // Atualizar saldo acumulado
            cumulativeBalance += positive - negative;

            // Formatar data de forma segura
            let formattedDate: string;
            try {
                formattedDate = date.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short'
                });
            } catch (error) {
                formattedDate = `${date.getDate().toString().padStart(2, '0')} ${date.toLocaleDateString('pt-BR', { month: 'short' })}`;
            }

            data.push({
                date: formattedDate,
                positive: isNaN(positive) ? 0 : positive,
                negative: isNaN(negative) ? 0 : negative, // Valores absolutos para as barras
                flow: Math.max(0, cumulativeBalance) // Saldo acumulado sempre positivo ou zero
            });
        }

        return data;
    }

    private calculateTopExpenses(transactions: Transaction[]): TopExpense[] {
        const expenseMap = new Map<string, { amount: number; count: number }>();

        // Garantir que transactions seja um array válido
        const validTransactions = Array.isArray(transactions) ? transactions : [];

        validTransactions
            .filter(t => t && (t.type === 'expense' || t.type === 'EXPENSE') && t.amount)
            .forEach(t => {
                const category = t.category?.name || 'Outros';
                const current = expenseMap.get(category) || { amount: 0, count: 0 };
                const amount = typeof t.amount === 'number' ? t.amount : parseFloat(t.amount);

                if (!isNaN(amount)) {
                    expenseMap.set(category, {
                        amount: current.amount + Math.abs(amount),
                        count: current.count + 1
                    });
                }
            });

        const totalExpenses = Array.from(expenseMap.values())
            .reduce((sum, item) => sum + item.amount, 0);

        if (totalExpenses === 0) {
            return [];
        }

        return Array.from(expenseMap.entries())
            .map(([name, data], index) => ({
                position: index + 1,
                name,
                amount: data.amount,
                percentage: `${Math.round((data.amount / totalExpenses) * 100)}%`
            }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5);
    }

    private calculateBillsSummary(transactions: Transaction[]): BillsSummary {
        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        // Garantir que transactions seja um array válido
        const validTransactions = Array.isArray(transactions) ? transactions : [];

        const billsToPay = validTransactions.filter(t => {
            if (!t || !t.date || (t.type !== 'expense' && t.type !== 'EXPENSE')) return false;

            try {
                const tDate = new Date(t.date);
                if (isNaN(tDate.getTime())) return false;

                return tDate >= now && tDate <= nextWeek && t.amount;
            } catch (error) {
                return false;
            }
        });

        const billsToReceive = validTransactions.filter(t => {
            if (!t || !t.date || (t.type !== 'income' && t.type !== 'INCOME')) return false;

            try {
                const tDate = new Date(t.date);
                if (isNaN(tDate.getTime())) return false;

                return tDate >= now && tDate <= nextWeek && t.amount;
            } catch (error) {
                return false;
            }
        });

        const billsToPayAmount = billsToPay.reduce((sum, t) => {
            const amount = typeof t.amount === 'number' ? t.amount : parseFloat(t.amount);
            return sum + (isNaN(amount) ? 0 : Math.abs(amount));
        }, 0);

        const billsToReceiveAmount = billsToReceive.reduce((sum, t) => {
            const amount = typeof t.amount === 'number' ? t.amount : parseFloat(t.amount);
            return sum + (isNaN(amount) ? 0 : Math.abs(amount));
        }, 0);

        return {
            billsToPay: {
                count: billsToPay.length,
                amount: isNaN(billsToPayAmount) ? 0 : billsToPayAmount
            },
            billsToReceive: {
                count: billsToReceive.length,
                amount: isNaN(billsToReceiveAmount) ? 0 : billsToReceiveAmount
            }
        };
    }

    private filterCreditCards(accounts: Account[]): CreditCardSummary[] {
        // Garantir que accounts seja um array válido
        const validAccounts = Array.isArray(accounts) ? accounts : [];

        return validAccounts
            .filter(account => account && account.type?.category === 'credit_card')
            .map(account => {
                let balance = 0;
                if (typeof account.balance === 'number') {
                    balance = account.balance;
                } else if (typeof account.balance === 'string') {
                    balance = parseFloat(account.balance);
                }

                return {
                    name: account.name || 'Cartão sem nome',
                    limit: balance * 2, // Simular limite baseado no saldo
                    used: balance,
                    available: balance
                };
            });
    }

    // Métodos para criar dados de exemplo quando não há dados reais
    private createExampleSummary(accounts: Account[]): DashboardSummary {
        const totalBalance = accounts.reduce((sum, account) => {
            let balance = 0;
            if (typeof account.balance === 'number') {
                balance = account.balance;
            } else if (typeof account.balance === 'string') {
                balance = parseFloat(account.balance);
            }
            return sum + (isNaN(balance) ? 0 : balance);
        }, 0);

        return {
            totalBalance,
            monthlyIncome: 0,
            monthlyExpenses: 0,
            monthlyResult: 0,
            accountsCount: accounts.length
        };
    }

    private createExampleCashFlowData(period: 'week' | 'month'): CashFlowData[] {
        const days = period === 'week' ? 7 : 30;
        const data: CashFlowData[] = [];
        let cumulativeBalance = 5000; // Saldo inicial

        // Criar dados de exemplo mais realistas
        const baseIncome = 2000;
        const baseExpense = 1500;
        const variation = 0.4; // 40% de variação

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);

            const formattedDate = date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short'
            });

            // Simular variação aleatória nos valores
            const randomFactor = 0.7 + Math.random() * 0.6; // Entre 0.7 e 1.3
            const incomeVariation = 1 + (Math.random() - 0.5) * variation;
            const expenseVariation = 1 + (Math.random() - 0.5) * variation;

            const positive = Math.round(baseIncome * incomeVariation * randomFactor);
            const negative = Math.round(baseExpense * expenseVariation * randomFactor);

            // Atualizar saldo acumulado
            cumulativeBalance += positive - negative;

            data.push({
                date: formattedDate,
                positive,
                negative, // Valores absolutos para as barras
                flow: Math.max(0, cumulativeBalance) // Saldo acumulado sempre positivo ou zero
            });
        }

        return data;
    }

    private createExampleTopExpenses(): TopExpense[] {
        return [];
    }

    private createExampleBillsSummary(): BillsSummary {
        return {
            billsToPay: { count: 0, amount: 0 },
            billsToReceive: { count: 0, amount: 0 }
        };
    }

    private createExampleCreditCards(): CreditCardSummary[] {
        return [];
    }
}

export default new DashboardService();
