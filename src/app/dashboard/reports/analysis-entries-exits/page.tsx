"use client";

import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import { ClientOnly } from "../../../../components/layout/ClientOnly";
import styles from "./AnalysisEntriesExits.module.css";
import chartStyles from "../../../../styles/ChartStyles.module.css";
import {
  Download,
  Printer,
  ChevronDown,
  Loader2
} from "lucide-react";
import reportsService, { ReportFilters, ReportData } from "../../../../services/api/reports.service";
import { useToast } from "../../../../context/ToastContext";
import { ExportService } from "../../../../services/export.service";

export default function AnalysisEntriesExits() {
  const { success, error } = useToast();
  const isMountedRef = useRef(true);
  const [period, setPeriod] = useState("Outubro 2025");
  const [view, setView] = useState("Mensal");
  const [regime, setRegime] = useState("Caixa");
  const [considerUnpaid, setConsiderUnpaid] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);

  // Função para formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Função para formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  // Função para gerar relatório (simplificada - lógica movida para useEffect)
  const generateReport = async () => {
    // Esta função agora é chamada apenas pelo botão "Gerar relatório"
    // A lógica principal está no useEffect
    window.location.reload();
  };

  // Gerar relatório automaticamente ao carregar a página
  useEffect(() => {
    let isActive = true;

    const loadReport = async () => {
      if (isActive && isMountedRef.current) {
        try {
          setIsLoading(true);

          // Converter período para datas
          const currentDate = new Date();
          let startDate: string;
          let endDate: string;

          if (period === "Outubro 2025") {
            startDate = new Date(2025, 9, 1).toISOString();
            endDate = new Date(2025, 9, 31).toISOString();
          } else if (period === "Setembro 2025") {
            startDate = new Date(2025, 8, 1).toISOString();
            endDate = new Date(2025, 8, 30).toISOString();
          } else if (period === "Dezembro 2024") {
            startDate = new Date(2024, 11, 1).toISOString();
            endDate = new Date(2024, 11, 31).toISOString();
          } else if (period === "Novembro 2024") {
            startDate = new Date(2024, 10, 1).toISOString();
            endDate = new Date(2024, 10, 30).toISOString();
          } else if (period === "Outubro 2024") {
            startDate = new Date(2024, 9, 1).toISOString();
            endDate = new Date(2024, 9, 31).toISOString();
          } else {
            startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
            endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString();
          }

          const filters: ReportFilters = {
            startDate,
            endDate,
            period: view === "Mensal" ? "monthly" : view === "Semanal" ? "weekly" : "daily",
            regime: regime === "Caixa" ? "cash" : "accrual",
            considerUnpaid
          };

          const data = await reportsService.getIncomeExpenseAnalysis(filters);

          if (isActive && isMountedRef.current) {
            setReportData(data);
            setLastGenerated(new Date());
            success("Relatório gerado com sucesso!");
          }
        } catch (err: any) {
          console.error("❌ Erro ao gerar relatório:", err);
          if (isActive && isMountedRef.current) {
            error("Erro ao gerar relatório: " + (err.message || "Erro desconhecido"));
          }
        } finally {
          if (isActive && isMountedRef.current) {
            setIsLoading(false);
          }
        }
      }
    };

    loadReport();

    return () => {
      isActive = false;
      isMountedRef.current = false;
    };
  }, [period, view, regime, considerUnpaid, success, error]);

  // Função para obter dados do período atual
  const getCurrentPeriodData = () => {
    if (!reportData) return null;

    const periodKey = Object.keys(reportData.periodData)[0];
    return periodKey ? reportData.periodData[periodKey] : null;
  };

  const currentPeriodData = getCurrentPeriodData();

  // Função para exportar relatório
  const handleExport = async (format: 'pdf' | 'csv') => {
    if (!reportData) {
      error("Nenhum dado disponível para exportar");
      return;
    }

    try {
      const exportOptions = {
        title: "Relatório de Entradas e Saídas",
        period,
        view,
        regime,
        generatedAt: lastGenerated || new Date()
      };

      if (format === 'pdf') {
        // Capturar o elemento do gráfico
        const chartElement = document.querySelector('[data-testid="chart-container"]') as HTMLElement;
        await ExportService.exportToPDF(reportData, exportOptions, chartElement);
        success("Relatório exportado para PDF com sucesso!");
      } else {
        ExportService.exportToCSV(reportData, exportOptions);
        success("Relatório exportado para CSV com sucesso!");
      }
    } catch (err: any) {
      console.error("Erro ao exportar relatório:", err);
      error("Erro ao exportar relatório: " + (err.message || "Erro desconhecido"));
    }
  };

  return (
    <DashboardLayout>
      <ClientOnly>
        <div className={styles.container} data-testid="analysis-entries-exits">
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.titleSection}>
              <h1 className={styles.title}>Análise de entradas e saídas</h1>
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
                    <option value="Outubro 2025">Outubro 2025</option>
                    <option value="Setembro 2025">Setembro 2025</option>
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
                onClick={generateReport}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Gerando...
                  </>
                ) : (
                  "Gerar relatório"
                )}
              </button>
            </div>
          </div>

          {/* Report Content */}
          <div className={styles.reportSection}>
            <div className={styles.reportHeader}>
              <div className={styles.reportTitle}>
                <h2>Relatório de entradas x saídas</h2>
                <p className={styles.reportDescription}>
                  {reportData ? (
                    <>
                      De {formatDate(reportData.dateRange.startDate)} à {formatDate(reportData.dateRange.endDate)} |
                      Visão {view} | Regime {regime}
                      {lastGenerated && (
                        <span className={styles.lastGenerated}>
                          {" "}• Gerado em {lastGenerated.toLocaleString("pt-BR")}
                        </span>
                      )}
                    </>
                  ) : (
                    "Carregando dados do relatório..."
                  )}
                </p>
              </div>
              <div className={styles.reportActions}>
                <button
                  className={styles.actionButton}
                  onClick={() => handleExport('pdf')}
                  disabled={!reportData}
                >
                  <Download size={16} />
                  Exportar PDF
                </button>
                <button
                  className={styles.actionButton}
                  onClick={() => handleExport('csv')}
                  disabled={!reportData}
                >
                  <Download size={16} />
                  Exportar CSV
                </button>
                <button
                  className={styles.actionButton}
                  onClick={() => window.print()}
                  disabled={!reportData}
                >
                  <Printer size={16} />
                  Imprimir
                </button>
              </div>
            </div>

            {/* Chart Section */}
            <div className={styles.chartSection}>
              {isLoading ? (
                <div className={styles.loadingContainer}>
                  <Loader2 size={32} className="animate-spin" />
                  <p>Gerando relatório...</p>
                </div>
              ) : reportData ? (
                <div className={styles.chartContainer} data-testid="chart-container">
                  <div className={styles.chart}>
                    <div className={chartStyles.chartBars}>
                      <div className={chartStyles.barContainer}>
                        <div
                          className={`${chartStyles.bar} ${chartStyles.entryBar}`}
                          style={{
                            height: `${Math.max(15, (reportData.summary.totalIncome / Math.max(reportData.summary.totalIncome, reportData.summary.totalExpenses, 1)) * 60)}px`
                          }}
                        ></div>
                        <div className={chartStyles.barLabel}>Entrada</div>
                        <div className={chartStyles.barValue}>{formatCurrency(reportData.summary.totalIncome)}</div>
                      </div>
                      <div className={chartStyles.barContainer}>
                        <div
                          className={`${chartStyles.bar} ${chartStyles.exitBar}`}
                          style={{
                            height: `${Math.max(15, (reportData.summary.totalExpenses / Math.max(reportData.summary.totalIncome, reportData.summary.totalExpenses, 1)) * 60)}px`
                          }}
                        ></div>
                        <div className={chartStyles.barLabel}>Saída</div>
                        <div className={chartStyles.barValue}>{formatCurrency(reportData.summary.totalExpenses)}</div>
                      </div>
                    </div>
                    <div className={styles.chartAxis}>
                      <div className={styles.yAxis}>
                        {(() => {
                          const maxValue = Math.max(reportData.summary.totalIncome, reportData.summary.totalExpenses);
                          const step = maxValue / 5;
                          return Array.from({ length: 6 }, (_, i) => (
                            <div key={i} className={styles.yLabel}>
                              {formatCurrency(maxValue - (step * i))}
                            </div>
                          ));
                        })()}
                      </div>
                      <div className={styles.xAxis}>
                        <div className={styles.xLabel}>
                          {period === "Outubro 2025" ? "OUT" :
                            period === "Setembro 2025" ? "SET" :
                              period === "Dezembro 2024" ? "DEZ" :
                                period === "Novembro 2024" ? "NOV" :
                                  period === "Outubro 2024" ? "OUT" : "ATUAL"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.chartLegend}>
                    <div className={styles.legendItem}>
                      <div className={`${styles.legendDot} ${styles.entryDot}`}></div>
                      <span>Entrada</span>
                    </div>
                    <div className={styles.legendItem}>
                      <div className={`${styles.legendDot} ${styles.exitDot}`}></div>
                      <span>Saída</span>
                    </div>
                    <div className={styles.legendItem}>
                      <div className={`${styles.legendDot} ${styles.balanceDot}`}></div>
                      <span>Saldo</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.noDataContainer}>
                  <p>Nenhum dado disponível</p>
                </div>
              )}
            </div>

            {/* Summary Table */}
            <div className={styles.tableSection}>
              {isLoading ? (
                <div className={styles.loadingContainer}>
                  <Loader2 size={24} className="animate-spin" />
                  <p>Carregando dados da tabela...</p>
                </div>
              ) : reportData ? (
                <table className={styles.summaryTable}>
                  <thead>
                    <tr>
                      <th>Período</th>
                      <th>Entradas</th>
                      <th>Saídas</th>
                      <th>Resultado</th>
                      <th>Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {period === "Outubro 2025" ? "Out de 2025" :
                          period === "Setembro 2025" ? "Set de 2025" :
                            period === "Dezembro 2024" ? "Dez de 2024" :
                              period === "Novembro 2024" ? "Nov de 2024" :
                                period === "Outubro 2024" ? "Out de 2024" : "Período atual"}
                      </td>
                      <td className={styles.entryValue}>
                        {formatCurrency(reportData.summary.totalIncome)}
                      </td>
                      <td className={styles.exitValue}>
                        {formatCurrency(reportData.summary.totalExpenses)}
                      </td>
                      <td className={`${styles.resultValue} ${reportData.summary.netResult >= 0 ? styles.positive : styles.negative}`}>
                        {formatCurrency(reportData.summary.netResult)}
                      </td>
                      <td className={styles.balanceValue}>
                        {formatCurrency(reportData.summary.totalBalance)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <div className={styles.noDataContainer}>
                  <p>Nenhum dado disponível para exibir na tabela</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </ClientOnly>
    </DashboardLayout>
  );
}