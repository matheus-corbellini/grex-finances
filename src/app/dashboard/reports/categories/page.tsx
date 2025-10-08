"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import { ClientOnly } from "../../../../components/layout/ClientOnly";
import styles from "./Categories.module.css";
import {
    Download,
    Printer,
    ChevronDown
} from "lucide-react";
import reportsService from "../../../../services/api/reports.service";

interface CategoryData {
    categoryId: string;
    categoryName: string;
    type: string;
    total: number;
    transactionCount: number;
    color?: string;
}

interface CategoryReportData {
    summary: {
        totalIncome: number;
        totalExpenses: number;
        transactionCount: number;
    };
    incomeByCategory: CategoryData[];
    expenseByCategory: CategoryData[];
    dateRange: {
        startDate: string;
        endDate: string;
    };
    filters: {
        period: string;
        regime: string;
        considerUnpaid: boolean;
        categoryId?: string;
        accountId?: string;
    };
}

export default function Categories() {
    const [category, setCategory] = useState("Todas");
    const [period, setPeriod] = useState("Junho de 2024");
    const [regime1, setRegime1] = useState("Caixa");
    const [regime2, setRegime2] = useState("Todas");
    const [considerUnpaid, setConsiderUnpaid] = useState(false);
    const [data, setData] = useState<CategoryReportData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        setError(null);

        try {
            const startDate = new Date(2024, 5, 1).toISOString(); // Junho de 2024
            const endDate = new Date(2024, 5, 30).toISOString();

            const filters = {
                startDate,
                endDate,
                period: 'monthly' as 'monthly' | 'weekly' | 'daily',
                regime: (regime1.toLowerCase() === 'caixa' ? 'cash' : 'accrual') as 'cash' | 'accrual',
                considerUnpaid,
                categoryId: category !== 'Todas' ? category : undefined,
                accountId: regime2 !== 'Todas' ? regime2 : undefined
            };

            const result = await reportsService.getCategoryAnalysis(filters);
            setData(result);
        } catch (err) {
            setError('Erro ao carregar dados do relatório');
            console.error('Erro ao carregar relatório por categorias:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [category, period, regime1, regime2, considerUnpaid]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const calculatePercentage = (value: number, total: number) => {
        return total > 0 ? ((value / total) * 100).toFixed(0) : '0';
    };

    return (
        <DashboardLayout>
            <ClientOnly>
                <div className={styles.container}>
                    {/* Header */}
                    <div className={styles.header}>
                        <div className={styles.titleSection}>
                            <h1 className={styles.title}>Entradas e saídas por categorias</h1>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className={styles.filtersSection}>
                        <div className={styles.filtersRow}>
                            <div className={styles.filterGroup}>
                                <label className={styles.filterLabel}>Categoria</label>
                                <div className={styles.selectWrapper}>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className={styles.select}
                                    >
                                        <option value="Todas">Todas</option>
                                        <option value="Dízimos">Dízimos</option>
                                        <option value="Ofertas">Ofertas</option>
                                        <option value="Rendimentos">Rendimentos</option>
                                    </select>
                                    <ChevronDown size={16} className={styles.selectIcon} />
                                </div>
                            </div>

                            <div className={styles.filterGroup}>
                                <label className={styles.filterLabel}>Período</label>
                                <div className={styles.selectWrapper}>
                                    <select
                                        value={period}
                                        onChange={(e) => setPeriod(e.target.value)}
                                        className={styles.select}
                                    >
                                        <option value="Junho de 2024">Junho de 2024</option>
                                        <option value="Maio de 2024">Maio de 2024</option>
                                        <option value="Abril de 2024">Abril de 2024</option>
                                    </select>
                                    <ChevronDown size={16} className={styles.selectIcon} />
                                </div>
                            </div>

                            <div className={styles.filterGroup}>
                                <label className={styles.filterLabel}>Regime</label>
                                <div className={styles.selectWrapper}>
                                    <select
                                        value={regime1}
                                        onChange={(e) => setRegime1(e.target.value)}
                                        className={styles.select}
                                    >
                                        <option value="Caixa">Caixa</option>
                                        <option value="Competência">Competência</option>
                                    </select>
                                    <ChevronDown size={16} className={styles.selectIcon} />
                                </div>
                            </div>

                            <div className={styles.filterGroup}>
                                <label className={styles.filterLabel}>Conta</label>
                                <div className={styles.selectWrapper}>
                                    <select
                                        value={regime2}
                                        onChange={(e) => setRegime2(e.target.value)}
                                        className={styles.select}
                                    >
                                        <option value="Todas">Todas</option>
                                        <option value="Conta Corrente">Conta Corrente</option>
                                        <option value="Poupança">Poupança</option>
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

                            <button className={styles.generateButton} onClick={loadData} disabled={loading}>
                                {loading ? 'Carregando...' : 'Gerar relatório'}
                            </button>
                        </div>
                    </div>

                    {/* Report Content */}
                    <div className={styles.reportSection}>
                        <div className={styles.reportHeader}>
                            <div className={styles.reportTitle}>
                                <h2>Relatório de entradas e saídas por categoria</h2>
                                <p className={styles.reportDescription}>
                                    {data ? `${formatDate(data.dateRange.startDate)} à ${formatDate(data.dateRange.endDate)} | Visão Mensal | Conta ${regime2}` : 'Carregando...'}
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

                        {/* Charts Section */}
                        <div className={styles.chartsSection}>
                            <div className={styles.chartsContainer}>
                                {/* Income Chart */}
                                <div className={styles.chartContainer}>
                                    <h3 className={styles.chartTitle}>Entradas</h3>
                                    <div className={styles.donutChart}>
                                        <div className={styles.donutInner}>
                                            <div className={styles.donutSegment} style={{
                                                background: 'conic-gradient(#10b981 0deg 120deg, #059669 120deg 240deg, #047857 240deg 360deg)',
                                                borderRadius: '50%'
                                            }}></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Expenses Chart */}
                                <div className={styles.chartContainer}>
                                    <h3 className={styles.chartTitle}>Saídas</h3>
                                    <div className={styles.donutChart}>
                                        <div className={styles.donutInner}>
                                            <div className={styles.donutSegment} style={{
                                                background: 'conic-gradient(#ef4444 0deg 120deg, #dc2626 120deg 240deg, #991b1b 240deg 360deg)',
                                                borderRadius: '50%'
                                            }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Categories Table */}
                        {data && (
                            <div className={styles.tableSection}>
                                <table className={styles.categoriesTable}>
                                    <thead>
                                        <tr>
                                            <th>Cor</th>
                                            <th>Categoria</th>
                                            <th>Tipo</th>
                                            <th>Percentual</th>
                                            <th>Valor</th>
                                            <th>Transações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[...data.incomeByCategory, ...data.expenseByCategory].map((item, index) => (
                                            <tr key={`${item.categoryId}-${item.type}`}>
                                                <td>
                                                    <div
                                                        className={styles.colorDot}
                                                        style={{ backgroundColor: item.color || '#6b7280' }}
                                                    ></div>
                                                </td>
                                                <td>
                                                    <div className={styles.categoryName}>
                                                        {item.categoryName}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={item.type === 'income' ? styles.incomeType : styles.expenseType}>
                                                        {item.type === 'income' ? 'Entrada' : 'Saída'}
                                                    </span>
                                                </td>
                                                <td className={styles.percentage}>
                                                    {item.type === 'income'
                                                        ? `${calculatePercentage(item.total, data.summary.totalIncome)}%`
                                                        : `${calculatePercentage(item.total, data.summary.totalExpenses)}%`
                                                    }
                                                </td>
                                                <td className={styles.value}>
                                                    {formatCurrency(item.total)}
                                                </td>
                                                <td className={styles.transactionCount}>
                                                    {item.transactionCount}
                                                </td>
                                            </tr>
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
