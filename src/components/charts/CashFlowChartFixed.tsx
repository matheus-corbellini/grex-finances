import React from 'react';
import styles from './CashFlowChartFixed.module.css';

interface CashFlowData {
    [key: string]: {
        income: number;
        expenses: number;
        net: number;
        balance: number;
    };
}

interface CashFlowChartFixedProps {
    data: CashFlowData;
    type: string;
}

const CashFlowChartFixed: React.FC<CashFlowChartFixedProps> = ({ data, type }) => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const getMonthName = (periodKey: string) => {
        const [year, month] = periodKey.split('-');
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        return monthNames[parseInt(month) - 1];
    };

    const periods = Object.keys(data);
    if (periods.length === 0) {
        return (
            <div className={styles.chartContainer}>
                <div className={styles.noDataMessage}>
                    Nenhum dado disponível para o período selecionado
                </div>
            </div>
        );
    }

    // Calcular valores para escala das barras (apenas entradas e saídas)
    const incomeValues = Object.values(data).map(d => d.income);
    const expenseValues = Object.values(data).map(d => d.expenses);
    const maxIncome = Math.max(...incomeValues);
    const maxExpense = Math.max(...expenseValues);
    const maxBarValue = Math.max(maxIncome, maxExpense);

    // Calcular valores para escala do saldo
    const balanceValues = Object.values(data).map(d => d.balance);
    const maxBalance = Math.max(...balanceValues);
    const minBalance = Math.min(...balanceValues);
    const balanceRange = maxBalance - minBalance;

    console.log('Chart Debug:', {
        maxBarValue,
        maxIncome,
        maxExpense,
        maxBalance,
        minBalance,
        balanceRange,
        sampleData: Object.values(data)[0]
    });

    return (
        <div className={styles.chartContainer}>
            <div className={styles.chart}>
                {/* Eixo Y simplificado */}
                <div className={styles.yAxisBars}>
                    <div className={styles.yLabel}>{formatCurrency(maxBarValue)}</div>
                    <div className={styles.yLabel}>{formatCurrency(maxBarValue * 0.5)}</div>
                    <div className={styles.yLabel}>R$ 0,00</div>
                </div>

                {/* Área do gráfico */}
                <div className={styles.chartArea}>
                    {/* Barras */}
                    <div className={styles.barsContainer}>
                        {periods.map((periodKey, index) => {
                            const periodData = data[periodKey];

                            // Alturas das barras baseadas na escala de entradas/saídas
                            const incomeHeight = maxBarValue > 0 ? (periodData.income / maxBarValue) * 100 : 0;
                            const expenseHeight = maxBarValue > 0 ? (periodData.expenses / maxBarValue) * 100 : 0;

                            // Posição do saldo baseada na escala de saldos
                            const balancePosition = balanceRange > 0 ?
                                ((periodData.balance - minBalance) / balanceRange) * 100 : 50;

                            return (
                                <div key={periodKey} className={styles.barGroup}>
                                    {/* Barras lado a lado */}
                                    <div className={styles.barPair}>
                                        <div
                                            className={`${styles.bar} ${styles.incomeBar}`}
                                            style={{ height: `${Math.max(incomeHeight, 3)}%` }}
                                            title={`Entradas: ${formatCurrency(periodData.income)}`}
                                        />
                                        <div
                                            className={`${styles.bar} ${styles.expenseBar}`}
                                            style={{ height: `${Math.max(expenseHeight, 3)}%` }}
                                            title={`Saídas: ${formatCurrency(periodData.expenses)}`}
                                        />
                                    </div>

                                    {/* Ponto do saldo */}
                                    <div
                                        className={styles.balanceDot}
                                        style={{
                                            bottom: `${balancePosition}%`,
                                            left: '50%',
                                            transform: 'translateX(-50%)'
                                        }}
                                        title={`Saldo: ${formatCurrency(periodData.balance)}`}
                                    />

                                    {/* Label do mês */}
                                    <div className={styles.monthLabel}>
                                        {getMonthName(periodKey)}
                                    </div>

                                    {/* Valores simplificados */}
                                    <div className={styles.valuesContainer}>
                                        <div className={styles.balanceValue}>
                                            {formatCurrency(periodData.balance)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>

            {/* Legenda */}
            <div className={styles.legend}>
                <div className={styles.legendItem}>
                    <div className={`${styles.legendDot} ${styles.incomeDot}`}></div>
                    <span>Entrada {type.toLowerCase()}</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={`${styles.legendDot} ${styles.expenseDot}`}></div>
                    <span>Saída {type.toLowerCase()}</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={`${styles.legendDot} ${styles.balanceDot}`}></div>
                    <span>Saldo {type.toLowerCase()}</span>
                </div>
            </div>
        </div>
    );
};

export default CashFlowChartFixed;
