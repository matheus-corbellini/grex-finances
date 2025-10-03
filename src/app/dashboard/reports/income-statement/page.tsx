"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import { ClientOnly } from "../../../../components/layout/ClientOnly";
import styles from "./IncomeStatement.module.css";
import {
    Download,
    Printer,
    ChevronDown
} from "lucide-react";
import reportsService from "../../../../services/api/reports.service";

interface DREItem {
    name: string;
    values: string[];
}

interface DREData {
    category: string;
    color: string;
    items: DREItem[];
}

interface IncomeStatementData {
    summary: {
        totalIncome: number;
        totalExpenses: number;
        netResult: number;
        transactionCount: number;
    };
    dreData: DREData[];
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

export default function IncomeStatement() {
    const [period, setPeriod] = useState("2024");
    const [view, setView] = useState("Mensal");
    const [regime, setRegime] = useState("Caixa");
    const [data, setData] = useState<IncomeStatementData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        setError(null);

        try {
            const startDate = new Date(parseInt(period), 0, 1).toISOString();
            const endDate = new Date(parseInt(period), 11, 31).toISOString();

            const filters = {
                startDate,
                endDate,
                period: view.toLowerCase() === 'mensal' ? 'monthly' : view.toLowerCase() === 'semanal' ? 'weekly' : 'daily',
                regime: regime.toLowerCase() === 'caixa' ? 'cash' : 'accrual',
                considerUnpaid: false
            };

            const result = await reportsService.getIncomeStatement(filters);
            setData(result);
        } catch (err) {
            setError('Erro ao carregar dados do relatório');
            console.error('Erro ao carregar DRE Gerencial:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [period, view, regime]);

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
                            <h1 className={styles.title}>DRE Gerencial</h1>
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
                                        <option value="2024">2024</option>
                                        <option value="2023">2023</option>
                                        <option value="2022">2022</option>
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

                            <button className={styles.generateButton} onClick={loadData} disabled={loading}>
                                {loading ? 'Carregando...' : 'Gerar relatório'}
                            </button>
                        </div>
                    </div>

                    {/* Report Content */}
                    <div className={styles.reportSection}>
                        <div className={styles.reportHeader}>
                            <div className={styles.reportTitle}>
                                <h2>DRE Gerencial</h2>
                                <p className={styles.reportDescription}>
                                    {data ? `${formatDate(data.dateRange.startDate)} à ${formatDate(data.dateRange.endDate)} | Visão ${view} | Regime ${regime}` : 'Carregando...'}
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

                        {error && (
                            <div className={styles.errorMessage}>
                                {error}
                            </div>
                        )}

                        {loading && (
                            <div className={styles.loadingMessage}>
                                Carregando dados do relatório...
                            </div>
                        )}

                        {/* DRE Table */}
                        {data && (
                            <div className={styles.tableSection}>
                                <table className={styles.dreTable}>
                                    <thead>
                                        <tr>
                                            <th>Período</th>
                                            {Object.keys(data.periodData).map((periodKey) => (
                                                <th key={periodKey}>{getMonthName(periodKey)} de {period}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.dreData.map((section, sectionIndex) => (
                                            <React.Fragment key={sectionIndex}>
                                                <tr className={styles.sectionHeader}>
                                                    <td className={styles.sectionTitle}>
                                                        <div className={styles.sectionTitleContent}>
                                                            <div className={`${styles.sectionDot} ${styles[section.color]}`}></div>
                                                            {section.category}
                                                        </div>
                                                    </td>
                                                    <td colSpan={Object.keys(data.periodData).length}></td>
                                                </tr>
                                                {section.items.map((item, itemIndex) => (
                                                    <tr key={itemIndex} className={styles.itemRow}>
                                                        <td className={styles.itemName}>{item.name}</td>
                                                        {item.values.map((value, valueIndex) => (
                                                            <td
                                                                key={valueIndex}
                                                                className={`${styles.itemValue} ${valueIndex === item.values.length - 1 ? styles.highlightedValue : ''}`}
                                                            >
                                                                {value}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </ClientOnly>
        </DashboardLayout>
    );
}
