"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import { ClientOnly } from "../../../../components/layout/ClientOnly";
import styles from "./BankAccounts.module.css";
import {
    Download,
    Printer,
    ChevronDown
} from "lucide-react";
import reportsService from "../../../../services/api/reports.service";
import BankAccountChart from "../../../../components/charts/BankAccountChart";

interface AccountData {
    accountId: string;
    accountName: string;
    balance: number;
    income: number;
    expenses: number;
    net: number;
    transactionCount: number;
    color?: string;
}

interface BankAccountReportData {
    summary: {
        totalBalance: number;
        totalIncome: number;
        totalExpenses: number;
        transactionCount: number;
    };
    accountData: AccountData[];
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

export default function BankAccounts() {
    const [period, setPeriod] = useState("Dezembro 2024");
    const [view, setView] = useState("Mensal");
    const [regime, setRegime] = useState("Caixa");
    const [considerUnpaid, setConsiderUnpaid] = useState(false);
    const [data, setData] = useState<BankAccountReportData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        setError(null);

        try {
            const startDate = new Date(2024, 11, 1).toISOString(); // Dezembro 2024
            const endDate = new Date(2024, 11, 31).toISOString();

            const filters = {
                startDate,
                endDate,
                period: view.toLowerCase() === 'mensal' ? 'monthly' : view.toLowerCase() === 'semanal' ? 'weekly' : 'daily',
                regime: regime.toLowerCase() === 'caixa' ? 'cash' : 'accrual',
                considerUnpaid
            };

            const result = await reportsService.getBankAccountAnalysis(filters);
            setData(result);
        } catch (err) {
            setError('Erro ao carregar dados do relatório');
            console.error('Erro ao carregar relatório por contas bancárias:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [period, view, regime, considerUnpaid]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const getMonthName = (periodKey: string) => {
        const [year, month] = periodKey.split('-');
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        return monthNames[parseInt(month) - 1];
    };

    return (
        <DashboardLayout>
            <ClientOnly>
                <div className={styles.container}>
                    {/* Header */}
                    <div className={styles.header}>
                        <div className={styles.titleSection}>
                            <h1 className={styles.title}>Entradas x saídas por contas bancárias</h1>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className={styles.filtersSection}>
                        <div className={styles.filtersRow}>
                            <div className={styles.filterGroup}>
                                <label className={styles.filterLabel}>Período</label>
                                <div className={styles.selectWrapper}>
                                    <select
                                        value={period}
                                        onChange={(e) => setPeriod(e.target.value)}
                                        className={styles.select}
                                    >
                                        <option value="Dezembro 2024">Dezembro 2024</option>
                                        <option value="Novembro 2024">Novembro 2024</option>
                                        <option value="Outubro 2024">Outubro 2024</option>
                                    </select>
                                    <ChevronDown size={16} className={styles.selectIcon} />
                                </div>
                            </div>

                            <div className={styles.filterGroup}>
                                <label className={styles.filterLabel}>Visão</label>
                                <div className={styles.selectWrapper}>
                                    <select
                                        value={view}
                                        onChange={(e) => setView(e.target.value)}
                                        className={styles.select}
                                    >
                                        <option value="Mensal">Mensal</option>
                                        <option value="Semanal">Semanal</option>
                                        <option value="Diária">Diária</option>
                                    </select>
                                    <ChevronDown size={16} className={styles.selectIcon} />
                                </div>
                            </div>

                            <div className={styles.filterGroup}>
                                <label className={styles.filterLabel}>Regime</label>
                                <div className={styles.selectWrapper}>
                                    <select
                                        value={regime}
                                        onChange={(e) => setRegime(e.target.value)}
                                        className={styles.select}
                                    >
                                        <option value="Caixa">Caixa</option>
                                        <option value="Competência">Competência</option>
                                    </select>
                                    <ChevronDown size={16} className={styles.selectIcon} />
                                </div>
                            </div>

                            <div className={styles.toggleGroup}>
                                <label className={styles.toggleLabel}>
                                    <input
                                        type="checkbox"
                                        checked={considerUnpaid}
                                        onChange={(e) => setConsiderUnpaid(e.target.checked)}
                                        className={styles.toggleInput}
                                    />
                                    <span className={styles.toggleSlider}></span>
                                    Considerar não pagos
                                </label>
                            </div>

                            <button
                                className={styles.generateButton}
                                onClick={loadData}
                                disabled={loading}
                            >
                                {loading ? 'Carregando...' : 'Gerar relatório'}
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className={styles.errorMessage}>
                            {error}
                        </div>
                    )}

                    {/* Loading Message */}
                    {loading && (
                        <div className={styles.loadingMessage}>
                            Carregando dados do relatório...
                        </div>
                    )}

                    {/* Report Content */}
                    {data && (
                        <div className={styles.reportSection}>
                            <div className={styles.reportHeader}>
                                <div className={styles.reportTitle}>
                                    <h2>Relatório de entradas x saídas por contas bancárias</h2>
                                    <p className={styles.reportDescription}>
                                        {formatDate(data.dateRange.startDate)} à {formatDate(data.dateRange.endDate)} |
                                        Visão {view} | Regime {regime}
                                    </p>
                                </div>
                                <div className={styles.reportActions}>
                                    <button className={styles.actionButton}>
                                        <Download size={16} />
                                        Exportar
                                    </button>
                                    <button className={styles.actionButton}>
                                        <Printer size={16} />
                                        Imprimir
                                    </button>
                                </div>
                            </div>

                            {/* Summary Cards */}
                            <div className={styles.summaryCards}>
                                <div className={styles.summaryCard}>
                                    <div className={styles.summaryCardTitle}>Saldo Total</div>
                                    <div className={styles.summaryCardValue}>{formatCurrency(data.summary.totalBalance)}</div>
                                </div>
                                <div className={styles.summaryCard}>
                                    <div className={styles.summaryCardTitle}>Entradas Totais</div>
                                    <div className={`${styles.summaryCardValue} ${styles.positiveValue}`}>{formatCurrency(data.summary.totalIncome)}</div>
                                </div>
                                <div className={styles.summaryCard}>
                                    <div className={styles.summaryCardTitle}>Saídas Totais</div>
                                    <div className={`${styles.summaryCardValue} ${styles.negativeValue}`}>{formatCurrency(data.summary.totalExpenses)}</div>
                                </div>
                                <div className={styles.summaryCard}>
                                    <div className={styles.summaryCardTitle}>Total de Transações</div>
                                    <div className={styles.summaryCardValue}>{data.summary.transactionCount}</div>
                                </div>
                            </div>

                            {/* Chart Section */}
                            <div className={styles.chartSection}>
                                <h3 className={styles.chartTitle}>Gráfico de Entradas x Saídas por Conta</h3>
                                <BankAccountChart data={data.accountData} />
                            </div>

                            {/* Summary Table */}
                            <div className={styles.tableSection}>
                                <h3 className={styles.tableTitle}>Tabela de Resumo</h3>
                                <table className={styles.summaryTable}>
                                    <thead>
                                        <tr>
                                            <th>Conta Bancária</th>
                                            <th>Entradas</th>
                                            <th>Saídas</th>
                                            <th>Resultado</th>
                                            <th>Saldo</th>
                                            <th>Transações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.accountData.map((account) => (
                                            <tr key={account.accountId}>
                                                <td className={styles.accountNameCell}>{account.accountName}</td>
                                                <td className={styles.entryValue}>{formatCurrency(account.income)}</td>
                                                <td className={styles.exitValue}>{formatCurrency(account.expenses)}</td>
                                                <td className={account.net >= 0 ? styles.positiveValue : styles.negativeValue}>
                                                    {formatCurrency(account.net)}
                                                </td>
                                                <td className={styles.balanceValue}>{formatCurrency(account.balance)}</td>
                                                <td className={styles.transactionCount}>{account.transactionCount}</td>
                                            </tr>
                                        ))}
                                        <tr className={styles.totalRow}>
                                            <td><strong>Total</strong></td>
                                            <td className={styles.entryValue}><strong>{formatCurrency(data.summary.totalIncome)}</strong></td>
                                            <td className={styles.exitValue}><strong>{formatCurrency(data.summary.totalExpenses)}</strong></td>
                                            <td className={data.summary.totalIncome - data.summary.totalExpenses >= 0 ? styles.positiveValue : styles.negativeValue}>
                                                <strong>{formatCurrency(data.summary.totalIncome - data.summary.totalExpenses)}</strong>
                                            </td>
                                            <td className={styles.balanceValue}><strong>{formatCurrency(data.summary.totalBalance)}</strong></td>
                                            <td><strong>{data.summary.transactionCount}</strong></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </ClientOnly>
        </DashboardLayout>
    );
}
