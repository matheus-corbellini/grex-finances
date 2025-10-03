"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import { ClientOnly } from "../../../../components/layout/ClientOnly";
import styles from "./CashFlow.module.css";
import {
  Download,
  Printer,
  ChevronDown
} from "lucide-react";
import reportsService from "../../../../services/api/reports.service";
import CashFlowChartFixed from "../../../../components/charts/CashFlowChartFixed";

interface CashFlowData {
  summary: {
    totalBalance: number;
    totalIncome: number;
    totalExpenses: number;
    transactionCount: number;
  };
  cashFlowData: { [key: string]: { income: number; expenses: number; net: number; balance: number } };
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

export default function CashFlow() {
  const [period, setPeriod] = useState("2024");
  const [view, setView] = useState("Mensal");
  const [type, setType] = useState("Realizado");
  const [data, setData] = useState<CashFlowData | null>(null);
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
        regime: type.toLowerCase() === 'realizado' ? 'cash' : 'accrual',
        considerUnpaid: type.toLowerCase() === 'comparativo'
      };

      const result = await reportsService.getCashFlowReport(filters);
      setData(result);
    } catch (err) {
      setError('Erro ao carregar dados do relatório');
      console.error('Erro ao carregar relatório de fluxo de caixa:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [period, view, type]);

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
              <h1 className={styles.title}>Relatório de fluxo de caixa</h1>
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
                <label className={styles.filterLabel}>Tipo</label>
                <div className={styles.selectWrapper}>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className={styles.select}
                  >
                    <option value="Realizado">Realizado</option>
                    <option value="Previsto">Previsto</option>
                    <option value="Comparativo">Comparativo</option>
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
                <h2>Relatório de fluxo de caixa {type.toLowerCase()}</h2>
                <p className={styles.reportDescription}>
                  {data ? `${formatDate(data.dateRange.startDate)} à ${formatDate(data.dateRange.endDate)} | Visão ${view}` : 'Carregando...'}
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

            {/* Chart Section */}
            {data && (
              <div className={styles.chartSection}>
                <CashFlowChartFixed data={data.cashFlowData} type={type} />
              </div>
            )}

            {/* Data Table */}
            {data && (
              <div className={styles.tableSection}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Período</th>
                      {Object.keys(data.cashFlowData).map((periodKey) => (
                        <th key={periodKey}>{getMonthName(periodKey)} de {period}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Total de saldos</td>
                      {Object.values(data.cashFlowData).map((periodData, index) => (
                        <td key={index}>
                          {formatCurrency(periodData.balance)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td>Entradas</td>
                      {Object.values(data.cashFlowData).map((periodData, index) => (
                        <td key={index}>
                          {formatCurrency(periodData.income)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td>Saídas</td>
                      {Object.values(data.cashFlowData).map((periodData, index) => (
                        <td key={index}>
                          {formatCurrency(periodData.expenses)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td>Saldo líquido</td>
                      {Object.values(data.cashFlowData).map((periodData, index) => (
                        <td key={index} className={periodData.net >= 0 ? styles.positiveValue : styles.negativeValue}>
                          {formatCurrency(periodData.net)}
                        </td>
                      ))}
                    </tr>
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