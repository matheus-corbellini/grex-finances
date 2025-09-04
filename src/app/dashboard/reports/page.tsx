"use client";

import React, { useState, useMemo } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { ClientOnly } from "../../../components/layout/ClientOnly";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  LineChart
} from "lucide-react";
import styles from "./Reports.module.css";

// Dados ilustrativos para os relatórios
const dummyData = {
  monthlyExpenses: [
    { month: "Jan", amount: 2500, category: "Alimentação" },
    { month: "Fev", amount: 3200, category: "Transporte" },
    { month: "Mar", amount: 1800, category: "Entretenimento" },
    { month: "Abr", amount: 4200, category: "Saúde" },
    { month: "Mai", amount: 2800, category: "Educação" },
    { month: "Jun", amount: 3500, category: "Vestuário" },
  ],
  categoryBreakdown: [
    { category: "Alimentação", amount: 4500, percentage: 25, color: "#3b82f6" },
    { category: "Transporte", amount: 3200, percentage: 18, color: "#10b981" },
    { category: "Saúde", amount: 2800, percentage: 16, color: "#f59e0b" },
    { category: "Entretenimento", amount: 2200, percentage: 12, color: "#ef4444" },
    { category: "Educação", amount: 1800, percentage: 10, color: "#8b5cf6" },
    { category: "Vestuário", amount: 1500, percentage: 8, color: "#06b6d4" },
    { category: "Outros", amount: 1200, percentage: 7, color: "#84cc16" },
  ],
  cardUsage: [
    { card: "Itaú Mastercard", usage: 75, limit: 8000, used: 6000 },
    { card: "Santander Visa", usage: 45, limit: 15000, used: 6750 },
    { card: "BB Amex", usage: 95, limit: 12000, used: 11400 },
  ],
  trends: {
    totalExpenses: 18200,
    previousMonth: 16500,
    growth: 10.3,
    averageDaily: 600,
    topCategory: "Alimentação"
  }
};

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("6m");
  const [selectedView, setSelectedView] = useState("overview");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getGrowthIcon = (growth: number) => {
    return growth > 0 ? <TrendingUp className={styles.growthIcon} /> : <TrendingDown className={styles.growthIcon} />;
  };

  const getGrowthColor = (growth: number) => {
    return growth > 0 ? styles.positive : styles.negative;
  };

  return (
    <DashboardLayout>
      <ClientOnly>
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <h1 className={styles.title}>Relatórios</h1>
              <p className={styles.subtitle}>Análise detalhada das suas finanças</p>
            </div>
            <div className={styles.headerActions}>
              <select
                className={styles.periodSelect}
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="1m">Último mês</option>
                <option value="3m">Últimos 3 meses</option>
                <option value="6m">Últimos 6 meses</option>
                <option value="1y">Último ano</option>
              </select>
              <button className={styles.actionButton}>
                <Filter size={16} />
                Filtrar
              </button>
              <button className={styles.actionButton}>
                <Download size={16} />
                Exportar
              </button>
            </div>
          </div>

          {/* View Toggle */}
          <div className={styles.viewToggle}>
            <button
              className={`${styles.toggleButton} ${selectedView === "overview" ? styles.active : ""}`}
              onClick={() => setSelectedView("overview")}
            >
              <BarChart3 size={16} />
              Visão Geral
            </button>
            <button
              className={`${styles.toggleButton} ${selectedView === "categories" ? styles.active : ""}`}
              onClick={() => setSelectedView("categories")}
            >
              <PieChart size={16} />
              Categorias
            </button>
            <button
              className={`${styles.toggleButton} ${selectedView === "trends" ? styles.active : ""}`}
              onClick={() => setSelectedView("trends")}
            >
              <LineChart size={16} />
              Tendências
            </button>
          </div>

          {/* Overview Cards */}
          <div className={styles.overviewCards}>
            <div className={styles.overviewCard}>
              <div className={styles.cardHeader}>
                <DollarSign className={styles.cardIcon} />
                <span className={styles.cardTitle}>Total de Gastos</span>
              </div>
              <div className={styles.cardContent}>
                <span className={styles.cardValue}>{formatCurrency(dummyData.trends.totalExpenses)}</span>
                <div className={`${styles.cardGrowth} ${getGrowthColor(dummyData.trends.growth)}`}>
                  {getGrowthIcon(dummyData.trends.growth)}
                  <span>{formatPercentage(dummyData.trends.growth)}</span>
                </div>
              </div>
            </div>

            <div className={styles.overviewCard}>
              <div className={styles.cardHeader}>
                <Calendar className={styles.cardIcon} />
                <span className={styles.cardTitle}>Gasto Médio Diário</span>
              </div>
              <div className={styles.cardContent}>
                <span className={styles.cardValue}>{formatCurrency(dummyData.trends.averageDaily)}</span>
                <div className={styles.cardSubtitle}>Últimos 30 dias</div>
              </div>
            </div>

            <div className={styles.overviewCard}>
              <div className={styles.cardHeader}>
                <CreditCard className={styles.cardIcon} />
                <span className={styles.cardTitle}>Categoria Principal</span>
              </div>
              <div className={styles.cardContent}>
                <span className={styles.cardValue}>{dummyData.trends.topCategory}</span>
                <div className={styles.cardSubtitle}>25% dos gastos</div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className={styles.chartsSection}>
            {selectedView === "overview" && (
              <>
                {/* Monthly Expenses Chart */}
                <div className={styles.chartCard}>
                  <h3 className={styles.chartTitle}>Gastos Mensais</h3>
                  <div className={styles.barChart}>
                    {dummyData.monthlyExpenses.map((item, index) => (
                      <div key={index} className={styles.barItem}>
                        <div className={styles.barContainer}>
                          <div
                            className={styles.bar}
                            style={{
                              height: `${(item.amount / 5000) * 100}%`,
                              backgroundColor: item.category === "Alimentação" ? "#3b82f6" :
                                item.category === "Transporte" ? "#10b981" :
                                  item.category === "Saúde" ? "#f59e0b" : "#ef4444"
                            }}
                          />
                        </div>
                        <span className={styles.barLabel}>{item.month}</span>
                        <span className={styles.barValue}>{formatCurrency(item.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Usage */}
                <div className={styles.chartCard}>
                  <h3 className={styles.chartTitle}>Uso dos Cartões</h3>
                  <div className={styles.cardUsageList}>
                    {dummyData.cardUsage.map((card, index) => (
                      <div key={index} className={styles.cardUsageItem}>
                        <div className={styles.cardInfo}>
                          <span className={styles.cardName}>{card.card}</span>
                          <span className={styles.cardLimit}>Limite: {formatCurrency(card.limit)}</span>
                        </div>
                        <div className={styles.usageBar}>
                          <div
                            className={styles.usageProgress}
                            style={{
                              width: `${card.usage}%`,
                              backgroundColor: card.usage > 80 ? "#ef4444" : card.usage > 60 ? "#f59e0b" : "#10b981"
                            }}
                          />
                        </div>
                        <div className={styles.usageInfo}>
                          <span className={styles.usagePercentage}>{card.usage}%</span>
                          <span className={styles.usageAmount}>{formatCurrency(card.used)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {selectedView === "categories" && (
              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>Gastos por Categoria</h3>
                <div className={styles.pieChartContainer}>
                  <div className={styles.pieChart}>
                    {dummyData.categoryBreakdown.map((item, index) => (
                      <div
                        key={index}
                        className={styles.pieSlice}
                        style={{
                          background: `conic-gradient(${item.color} 0deg ${item.percentage * 3.6}deg, transparent ${item.percentage * 3.6}deg)`
                        }}
                      />
                    ))}
                  </div>
                  <div className={styles.pieLegend}>
                    {dummyData.categoryBreakdown.map((item, index) => (
                      <div key={index} className={styles.legendItem}>
                        <div
                          className={styles.legendColor}
                          style={{ backgroundColor: item.color }}
                        />
                        <span className={styles.legendLabel}>{item.category}</span>
                        <span className={styles.legendValue}>{formatCurrency(item.amount)}</span>
                        <span className={styles.legendPercentage}>{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedView === "trends" && (
              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>Tendências de Gastos</h3>
                <div className={styles.trendsContent}>
                  <div className={styles.trendItem}>
                    <span className={styles.trendLabel}>Crescimento Mensal</span>
                    <div className={`${styles.trendValue} ${getGrowthColor(dummyData.trends.growth)}`}>
                      {getGrowthIcon(dummyData.trends.growth)}
                      {formatPercentage(dummyData.trends.growth)}
                    </div>
                  </div>
                  <div className={styles.trendItem}>
                    <span className={styles.trendLabel}>Comparação com Mês Anterior</span>
                    <div className={styles.trendComparison}>
                      <span>Este mês: {formatCurrency(dummyData.trends.totalExpenses)}</span>
                      <span>Mês anterior: {formatCurrency(dummyData.trends.previousMonth)}</span>
                    </div>
                  </div>
                  <div className={styles.trendItem}>
                    <span className={styles.trendLabel}>Projeção do Próximo Mês</span>
                    <div className={styles.trendProjection}>
                      {formatCurrency(dummyData.trends.totalExpenses * 1.05)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </ClientOnly>
    </DashboardLayout>
  );
}
