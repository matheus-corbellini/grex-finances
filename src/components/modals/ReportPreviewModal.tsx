"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import {
    FileText,
    Download,
    Share2,
    Calendar,
    BarChart3,
    PieChart,
    TrendingUp,
    TrendingDown,
    Minus,
    Eye,
    Printer,
    Mail,
    ExternalLink
} from "lucide-react";
import { Report, ReportType, ReportSummary, ChartData, ReportInsight } from "../../../shared/types/report.types";
import styles from "./ReportPreviewModal.module.css";

export interface ReportPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    report: Report;
    onExport?: (format: "pdf" | "csv" | "xlsx") => void;
    onShare?: () => void;
    onSchedule?: () => void;
    isLoading?: boolean;
}

export const ReportPreviewModal: React.FC<ReportPreviewModalProps> = ({
    isOpen,
    onClose,
    report,
    onExport,
    onShare,
    onSchedule,
    isLoading = false
}) => {
    const [activeTab, setActiveTab] = useState<"summary" | "charts" | "insights" | "details">("summary");

    const formatCurrency = (amount: number, currency: string = "BRL") => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: currency
        }).format(amount);
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }).format(new Date(date));
    };

    const getReportTypeLabel = (type: ReportType) => {
        const labels = {
            INCOME_STATEMENT: "Demonstração de Resultados",
            CASH_FLOW: "Fluxo de Caixa",
            NET_WORTH: "Patrimônio Líquido",
            SPENDING_ANALYSIS: "Análise de Gastos",
            BUDGET_PERFORMANCE: "Desempenho do Orçamento",
            INVESTMENT_PERFORMANCE: "Desempenho dos Investimentos",
            GOAL_PROGRESS: "Progresso das Metas",
            TRANSACTION_SUMMARY: "Resumo de Transações",
            CATEGORY_BREAKDOWN: "Detalhamento por Categoria",
            ACCOUNT_SUMMARY: "Resumo das Contas"
        };
        return labels[type] || type;
    };

    const getTrendIcon = (trend?: "up" | "down" | "stable") => {
        switch (trend) {
            case "up":
                return <TrendingUp size={16} className={styles.trendUp} />;
            case "down":
                return <TrendingDown size={16} className={styles.trendDown} />;
            default:
                return <Minus size={16} className={styles.trendStable} />;
        }
    };

    const getSeverityColor = (severity?: "info" | "warning" | "danger" | "success") => {
        switch (severity) {
            case "success":
                return "#10b981";
            case "warning":
                return "#f59e0b";
            case "danger":
                return "#ef4444";
            default:
                return "#3b82f6";
        }
    };

    const tabs = [
        { id: "summary", label: "Resumo", icon: FileText },
        { id: "charts", label: "Gráficos", icon: BarChart3 },
        { id: "insights", label: "Insights", icon: TrendingUp },
        { id: "details", label: "Detalhes", icon: Eye }
    ] as const;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Visualização de Relatório" size="large">
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.reportInfo}>
                        <div className={styles.reportTitle}>
                            <h2>{report.name}</h2>
                            <span className={styles.reportType}>{getReportTypeLabel(report.type)}</span>
                        </div>
                        <div className={styles.reportMeta}>
                            <div className={styles.metaItem}>
                                <Calendar size={16} />
                                <span>Gerado em {formatDate(report.generatedAt)}</span>
                            </div>
                            <div className={styles.metaItem}>
                                <Calendar size={16} />
                                <span>
                                    {formatDate(report.parameters.dateRange.startDate)} - {formatDate(report.parameters.dateRange.endDate)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onExport?.("pdf")}
                            disabled={isLoading}
                        >
                            <Download size={16} />
                            PDF
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onExport?.("csv")}
                            disabled={isLoading}
                        >
                            <Download size={16} />
                            CSV
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={onShare}
                            disabled={isLoading}
                        >
                            <Share2 size={16} />
                            Compartilhar
                        </Button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className={styles.tabNavigation}>
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <Icon size={16} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className={styles.tabContent}>
                    {activeTab === "summary" && (
                        <div className={styles.summarySection}>
                            <h3 className={styles.sectionTitle}>Resumo Executivo</h3>

                            <div className={styles.summaryGrid}>
                                <div className={styles.summaryCard}>
                                    <div className={styles.summaryHeader}>
                                        <TrendingUp size={20} className={styles.summaryIcon} />
                                        <span className={styles.summaryLabel}>Receita Total</span>
                                    </div>
                                    <div className={styles.summaryValue}>
                                        {formatCurrency(report.data.summary.totalIncome, report.data.summary.currency)}
                                    </div>
                                </div>

                                <div className={styles.summaryCard}>
                                    <div className={styles.summaryHeader}>
                                        <TrendingDown size={20} className={styles.summaryIcon} />
                                        <span className={styles.summaryLabel}>Despesas Totais</span>
                                    </div>
                                    <div className={styles.summaryValue}>
                                        {formatCurrency(report.data.summary.totalExpenses, report.data.summary.currency)}
                                    </div>
                                </div>

                                <div className={styles.summaryCard}>
                                    <div className={styles.summaryHeader}>
                                        <BarChart3 size={20} className={styles.summaryIcon} />
                                        <span className={styles.summaryLabel}>Resultado Líquido</span>
                                    </div>
                                    <div className={`${styles.summaryValue} ${report.data.summary.netIncome >= 0 ? styles.positive : styles.negative
                                        }`}>
                                        {formatCurrency(report.data.summary.netIncome, report.data.summary.currency)}
                                    </div>
                                </div>

                                <div className={styles.summaryCard}>
                                    <div className={styles.summaryHeader}>
                                        <PieChart size={20} className={styles.summaryIcon} />
                                        <span className={styles.summaryLabel}>Patrimônio Líquido</span>
                                    </div>
                                    <div className={styles.summaryValue}>
                                        {formatCurrency(report.data.summary.netWorth, report.data.summary.currency)}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.periodInfo}>
                                <h4>Período do Relatório</h4>
                                <p>{report.data.summary.period}</p>
                            </div>
                        </div>
                    )}

                    {activeTab === "charts" && (
                        <div className={styles.chartsSection}>
                            <h3 className={styles.sectionTitle}>Visualizações</h3>

                            <div className={styles.chartsGrid}>
                                {report.data.charts.map((chart, index) => (
                                    <div key={index} className={styles.chartCard}>
                                        <div className={styles.chartHeader}>
                                            <h4>{chart.title}</h4>
                                            <span className={styles.chartType}>{chart.type}</span>
                                        </div>
                                        <div className={styles.chartPlaceholder}>
                                            <BarChart3 size={48} />
                                            <p>Gráfico {chart.type}</p>
                                            <small>Dados: {chart.data.datasets[0]?.data.length || 0} pontos</small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "insights" && (
                        <div className={styles.insightsSection}>
                            <h3 className={styles.sectionTitle}>Insights e Análises</h3>

                            <div className={styles.insightsList}>
                                {report.data.insights.map((insight, index) => (
                                    <div key={index} className={styles.insightCard}>
                                        <div className={styles.insightHeader}>
                                            <div
                                                className={styles.insightIcon}
                                                style={{ backgroundColor: getSeverityColor(insight.severity) }}
                                            >
                                                {getTrendIcon(insight.trend)}
                                            </div>
                                            <div className={styles.insightInfo}>
                                                <h4>{insight.title}</h4>
                                                <span className={styles.insightSeverity}>
                                                    {insight.severity?.toUpperCase() || "INFO"}
                                                </span>
                                            </div>
                                        </div>
                                        <p className={styles.insightDescription}>{insight.description}</p>
                                        {insight.value && (
                                            <div className={styles.insightMetrics}>
                                                <div className={styles.metric}>
                                                    <span className={styles.metricLabel}>Valor:</span>
                                                    <span className={styles.metricValue}>
                                                        {formatCurrency(insight.value, report.data.summary.currency)}
                                                    </span>
                                                </div>
                                                {insight.change && (
                                                    <div className={styles.metric}>
                                                        <span className={styles.metricLabel}>Mudança:</span>
                                                        <span className={`${styles.metricValue} ${insight.change >= 0 ? styles.positive : styles.negative
                                                            }`}>
                                                            {insight.change >= 0 ? "+" : ""}{formatCurrency(insight.change, report.data.summary.currency)}
                                                        </span>
                                                    </div>
                                                )}
                                                {insight.changePercentage && (
                                                    <div className={styles.metric}>
                                                        <span className={styles.metricLabel}>Percentual:</span>
                                                        <span className={`${styles.metricValue} ${insight.changePercentage >= 0 ? styles.positive : styles.negative
                                                            }`}>
                                                            {insight.changePercentage >= 0 ? "+" : ""}{insight.changePercentage.toFixed(1)}%
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "details" && (
                        <div className={styles.detailsSection}>
                            <h3 className={styles.sectionTitle}>Detalhes do Relatório</h3>

                            <div className={styles.detailsGrid}>
                                <div className={styles.detailCard}>
                                    <h4>Parâmetros</h4>
                                    <div className={styles.detailList}>
                                        <div className={styles.detailItem}>
                                            <span className={styles.detailLabel}>Período:</span>
                                            <span className={styles.detailValue}>{report.parameters.dateRange.period}</span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <span className={styles.detailLabel}>Agrupamento:</span>
                                            <span className={styles.detailValue}>{report.parameters.groupBy || "N/A"}</span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <span className={styles.detailLabel}>Moeda:</span>
                                            <span className={styles.detailValue}>{report.parameters.currency || "BRL"}</span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <span className={styles.detailLabel}>Subcategorias:</span>
                                            <span className={styles.detailValue}>
                                                {report.parameters.includeSubcategories ? "Incluídas" : "Não incluídas"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.detailCard}>
                                    <h4>Configurações</h4>
                                    <div className={styles.detailList}>
                                        <div className={styles.detailItem}>
                                            <span className={styles.detailLabel}>Agendado:</span>
                                            <span className={styles.detailValue}>
                                                {report.isScheduled ? "Sim" : "Não"}
                                            </span>
                                        </div>
                                        {report.schedule && (
                                            <>
                                                <div className={styles.detailItem}>
                                                    <span className={styles.detailLabel}>Frequência:</span>
                                                    <span className={styles.detailValue}>{report.schedule.frequency}</span>
                                                </div>
                                                <div className={styles.detailItem}>
                                                    <span className={styles.detailLabel}>Próxima geração:</span>
                                                    <span className={styles.detailValue}>
                                                        {formatDate(report.schedule.nextGeneration)}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {report.description && (
                                <div className={styles.descriptionCard}>
                                    <h4>Descrição</h4>
                                    <p>{report.description}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <div className={styles.footerActions}>
                        <Button
                            variant="secondary"
                            onClick={() => onSchedule?.()}
                            disabled={isLoading}
                        >
                            <Calendar size={16} />
                            Agendar
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => window.print()}
                            disabled={isLoading}
                        >
                            <Printer size={16} />
                            Imprimir
                        </Button>
                    </div>

                    <div className={styles.footerActions}>
                        <Button
                            variant="secondary"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Fechar
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => onExport?.("pdf")}
                            loading={isLoading}
                        >
                            <Download size={16} />
                            Exportar PDF
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
