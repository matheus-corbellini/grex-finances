import React from 'react';
import styles from './CashFlowChart.module.css';

interface CashFlowData {
    [key: string]: {
        income: number;
        expenses: number;
        net: number;
        balance: number;
    };
}

interface CashFlowChartProps {
    data: CashFlowData;
    type: string;
}

const CashFlowChart: React.FC<CashFlowChartProps> = ({ data, type }) => {
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

    // Calcular valores máximos e mínimos para escala
    const allValues = Object.values(data).flatMap(d => [d.income, d.expenses, d.balance]);
    const maxValue = Math.max(...allValues);
    const minValue = Math.min(...allValues);

    // Para melhor visualização, vamos usar uma escala que começa do zero
    // e vai até o valor máximo, ignorando valores negativos para a escala das barras
    const maxBarValue = Math.max(...Object.values(data).flatMap(d => [d.income, d.expenses]));
    const range = maxBarValue || 1; // Escala baseada apenas em entradas e saídas

    // Debug: log dos valores para verificar
    console.log('CashFlow Chart Debug:', {
        maxBarValue,
        range,
        periods: periods.length,
        sampleData: Object.values(data)[0]
    });

    // Para o saldo, usamos uma escala separada que inclui valores negativos
    const balanceValues = Object.values(data).map(d => d.balance);
    const maxBalance = Math.max(...balanceValues);
    const minBalance = Math.min(...balanceValues);
    const balanceRange = maxBalance - minBalance || 1;

    // Gerar labels do eixo Y baseados na escala das barras
    const yLabels = [
        maxBarValue,
        maxBarValue * 0.75,
        maxBarValue * 0.5,
        maxBarValue * 0.25,
        0
    ];

    return (
        <div className={styles.chartContainer}>
            <div className={styles.chart}>
                {/* Eixo Y */}
                <div className={styles.yAxis}>
                    {yLabels.map((value, index) => (
                        <div key={index} className={styles.yLabel}>
                            {formatCurrency(value)}
                        </div>
                    ))}
                </div>

                {/* Área do gráfico */}
                <div className={styles.chartArea}>
                    {/* Linhas de grade */}
                    <div className={styles.gridLines}>
                        {yLabels.map((_, index) => (
                            <div key={index} className={styles.gridLine}></div>
                        ))}
                    </div>

                    {/* Barras */}
                    <div className={styles.barsContainer}>
                        {periods.map((periodKey, index) => {
                            const periodData = data[periodKey];
                            // Barras começam do zero e sobem até o valor máximo
                            const incomeHeight = range > 0 ? Math.max((periodData.income / range) * 100, 2) : 2;
                            const expenseHeight = range > 0 ? Math.max((periodData.expenses / range) * 100, 2) : 2;
                            // Saldo usa escala separada que inclui valores negativos
                            const balanceHeight = balanceRange > 0 ? ((periodData.balance - minBalance) / balanceRange) * 100 : 50;

                            return (
                                <div key={periodKey} className={styles.barGroup}>
                                    {/* Barras empilhadas */}
                                    <div className={styles.barStack}>
                                        <div
                                            className={`${styles.bar} ${styles.entryBar}`}
                                            style={{ height: `${Math.max(incomeHeight, 2)}%` }}
                                            title={`Entradas: ${formatCurrency(periodData.income)}`}
                                        />
                                        <div
                                            className={`${styles.bar} ${styles.exitBar}`}
                                            style={{ height: `${Math.max(expenseHeight, 2)}%` }}
                                            title={`Saídas: ${formatCurrency(periodData.expenses)}`}
                                        />
                                    </div>

                                    {/* Linha do saldo */}
                                    <div
                                        className={styles.balanceLine}
                                        style={{
                                            bottom: `${balanceHeight}%`,
                                            left: '50%',
                                            transform: 'translateX(-50%)'
                                        }}
                                    />

                                    {/* Label do mês */}
                                    <div className={styles.monthLabel}>
                                        {getMonthName(periodKey)}
                                    </div>

                                    {/* Valor do saldo */}
                                    <div className={styles.balanceValue}>
                                        {formatCurrency(periodData.balance)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Linha de conexão dos saldos */}
                    <svg className={styles.balanceLineChart} viewBox="0 0 100 100" preserveAspectRatio="none">
                        <polyline
                            points={periods.map((periodKey, index) => {
                                const periodData = data[periodKey];
                                const balanceHeight = balanceRange > 0 ? ((periodData.balance - minBalance) / balanceRange) * 100 : 50;
                                const x = periods.length > 1 ? (index / (periods.length - 1)) * 100 : 50;
                                const y = 100 - balanceHeight;
                                return `${x},${y}`;
                            }).join(' ')}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </div>

            {/* Legenda */}
            <div className={styles.legend}>
                <div className={styles.legendItem}>
                    <div className={`${styles.legendDot} ${styles.entryDot}`}></div>
                    <span>Entrada {type.toLowerCase()}</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={`${styles.legendDot} ${styles.exitDot}`}></div>
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

export default CashFlowChart;
