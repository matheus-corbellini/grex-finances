import React from 'react';
import styles from './BankAccountChart.module.css';

interface AccountData {
    accountId: string;
    accountName: string;
    balance: number;
    income: number;
    expenses: number;
    net: number;
    transactionCount: number;
}

interface BankAccountChartProps {
    data: AccountData[];
}

const BankAccountChart: React.FC<BankAccountChartProps> = ({ data }) => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    if (!data || data.length === 0) {
        return (
            <div className={styles.chartContainer}>
                <div className={styles.noDataMessage}>
                    Nenhum dado disponível para exibir
                </div>
            </div>
        );
    }

    // Calcular valores máximos para escala
    const maxIncome = Math.max(...data.map(account => account.income));
    const maxExpense = Math.max(...data.map(account => account.expenses));
    const maxValue = Math.max(maxIncome, maxExpense);
    const scale = maxValue > 0 ? maxValue : 1;

    return (
        <div className={styles.chartContainer}>
            <div className={styles.chart}>
                {/* Eixo Y */}
                <div className={styles.yAxis}>
                    <div className={styles.yLabel}>{formatCurrency(scale)}</div>
                    <div className={styles.yLabel}>{formatCurrency(scale * 0.75)}</div>
                    <div className={styles.yLabel}>{formatCurrency(scale * 0.5)}</div>
                    <div className={styles.yLabel}>{formatCurrency(scale * 0.25)}</div>
                    <div className={styles.yLabel}>R$ 0,00</div>
                </div>

                {/* Área do gráfico */}
                <div className={styles.chartArea}>
                    {data.map((account, index) => {
                        const incomeHeight = scale > 0 ? (account.income / scale) * 100 : 0;
                        const expenseHeight = scale > 0 ? (account.expenses / scale) * 100 : 0;

                        return (
                            <div key={account.accountId} className={styles.accountGroup}>
                                {/* Barras */}
                                <div className={styles.barsContainer}>
                                    <div
                                        className={`${styles.bar} ${styles.incomeBar}`}
                                        style={{ height: `${Math.max(incomeHeight, 2)}%` }}
                                        title={`Entradas: ${formatCurrency(account.income)}`}
                                    />
                                    <div
                                        className={`${styles.bar} ${styles.expenseBar}`}
                                        style={{ height: `${Math.max(expenseHeight, 2)}%` }}
                                        title={`Saídas: ${formatCurrency(account.expenses)}`}
                                    />
                                </div>

                                {/* Nome da conta */}
                                <div className={styles.accountName}>
                                    {account.accountName.length > 15
                                        ? `${account.accountName.substring(0, 15)}...`
                                        : account.accountName
                                    }
                                </div>

                                {/* Valores */}
                                <div className={styles.valuesContainer}>
                                    <div className={styles.incomeValue}>
                                        {formatCurrency(account.income)}
                                    </div>
                                    <div className={styles.expenseValue}>
                                        {formatCurrency(account.expenses)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Legenda */}
            <div className={styles.legend}>
                <div className={styles.legendItem}>
                    <div className={`${styles.legendDot} ${styles.incomeDot}`}></div>
                    <span>Entradas</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={`${styles.legendDot} ${styles.expenseDot}`}></div>
                    <span>Saídas</span>
                </div>
            </div>
        </div>
    );
};

export default BankAccountChart;
