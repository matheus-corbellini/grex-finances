"use client";

import React, { useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { ChevronLeft, ChevronRight, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { BankIconComponent } from "../../../components/ui/BankIcons";
import styles from "./Accounts.module.css";

interface Account {
  id: number;
  bankName: string;
  bankLogo: string;
  accountType: string;
  balance: string;
  actionLink: string;
  actionButton: string;
  graphData: { date: string; value: number }[];
  trend: 'up' | 'down';
}

export default function Accounts() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 6, 1)); // Julho 2024

  const accounts: Account[] = [
    {
      id: 1,
      bankName: "Banco cooperativo Sicredi S.A",
      bankLogo: "🌺",
      accountType: "conta corrente",
      balance: "R$25.000,00",
      actionLink: "Ver extrato",
      actionButton: "Conciliar",
      trend: 'up',
      graphData: [
        { date: "09 jan", value: 10.5 },
        { date: "10 jan", value: 12.0 },
        { date: "11 jan", value: 13.5 },
        { date: "12 jan", value: 15.0 }
      ]
    },
    {
      id: 2,
      bankName: "Banco do Brasil S.A",
      bankLogo: "🏦",
      accountType: "conta corrente",
      balance: "R$31.000,00",
      actionLink: "Ver detalhes",
      actionButton: "Regularizar",
      trend: 'up',
      graphData: [
        { date: "09 jan", value: 12.0 },
        { date: "10 jan", value: 14.5 },
        { date: "11 jan", value: 16.0 },
        { date: "12 jan", value: 17.0 }
      ]
    },
    {
      id: 3,
      bankName: "Itaú Unibanco S.A",
      bankLogo: "🏛️",
      accountType: "conta corrente",
      balance: "R$19.000,00",
      actionLink: "Ver saldo",
      actionButton: "Revisar",
      trend: 'up',
      graphData: [
        { date: "09 jan", value: 9.5 },
        { date: "10 jan", value: 11.0 },
        { date: "11 jan", value: 12.5 },
        { date: "12 jan", value: 14.5 }
      ]
    },
    {
      id: 4,
      bankName: "Santander S.A",
      bankLogo: "🔥",
      accountType: "conta corrente",
      balance: "R$23.500,00",
      actionLink: "Consultar extrato",
      actionButton: "Ajustar",
      trend: 'up',
      graphData: [
        { date: "09 jan", value: 11.0 },
        { date: "10 jan", value: 13.0 },
        { date: "11 jan", value: 14.5 },
        { date: "12 jan", value: 16.0 }
      ]
    },
    {
      id: 5,
      bankName: "Bradesco S.A",
      bankLogo: "🏪",
      accountType: "conta corrente",
      balance: "R$28.000,00",
      actionLink: "Ver consulta",
      actionButton: "Analisar",
      trend: 'up',
      graphData: [
        { date: "09 jan", value: 16.0 },
        { date: "10 jan", value: 17.5 },
        { date: "11 jan", value: 18.0 },
        { date: "12 jan", value: 19.0 }
      ]
    },
    {
      id: 6,
      bankName: "Caixa Econômica Federal",
      bankLogo: "🏛️",
      accountType: "conta corrente",
      balance: "R$36.500,00",
      actionLink: "Visualizar transações",
      actionButton: "Fechar",
      trend: 'up',
      graphData: [
        { date: "09 jan", value: 19.0 },
        { date: "10 jan", value: 20.0 },
        { date: "11 jan", value: 20.5 },
        { date: "12 jan", value: 21.0 }
      ]
    }
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric'
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getGraphHeight = (value: number, maxValue: number) => {
    return (value / maxValue) * 100;
  };

  const getMaxValue = (graphData: { value: number }[]) => {
    return Math.max(...graphData.map(d => d.value));
  };

  const generateLinePath = (data: any[], maxValue: number) => {
    const points = data.map((point, index) => {
      const x = (index / (data.length - 1)) * 200;
      const y = 80 - (point.value / maxValue) * 80;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  const generateAreaPath = (data: any[], maxValue: number) => {
    const linePath = generateLinePath(data, maxValue);
    const firstX = 0;
    const lastX = 200;
    const bottomY = 80;

    return `${linePath} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;
  };

  return (
    <DashboardLayout>
      <div className={styles.accountsContainer}>
        {/* Barra de controles superior */}
        <div className={styles.controlsBar}>
          <div className={styles.leftControls}>
            <div className={styles.viewButtons}>
              <button className={`${styles.viewButton} ${styles.active}`}>
                Mês
              </button>
              <button className={styles.viewButton}>
                Semana
              </button>
              <button className={styles.viewButton}>
                Filtros
              </button>
            </div>
          </div>

          <div className={styles.rightControls}>
            <div className={styles.dateNavigation}>
              <button
                className={styles.dateButton}
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft size={16} />
              </button>
              <span className={styles.currentDate}>
                {formatDate(currentDate)}
              </span>
              <button
                className={styles.dateButton}
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Grid de contas */}
        <div className={styles.accountsGrid}>
          {accounts.map((account) => {
            const maxValue = getMaxValue(account.graphData);

            return (
              <div key={account.id} className={styles.accountCard}>
                {/* Header do card */}
                <div className={styles.cardHeader}>
                  <div className={styles.bankInfo}>
                    <div className={styles.bankLogo}>
                      <BankIconComponent bankName={account.bankName} size={32} />
                    </div>
                    <div className={styles.bankDetails}>
                      <h3 className={styles.bankName}>{account.bankName}</h3>
                      <p className={styles.accountType}>({account.accountType})</p>
                    </div>
                  </div>
                </div>

                {/* Saldo */}
                <div className={styles.balanceSection}>
                  <div className={styles.balanceValue}>{account.balance}</div>
                </div>

                {/* Ações */}
                <div className={styles.actionsSection}>
                  <a href="#" className={styles.actionLink}>
                    {account.actionLink}
                  </a>
                  <button className={styles.actionButton}>
                    {account.actionButton}
                  </button>
                </div>

                {/* Gráfico */}
                <div className={styles.graphSection}>
                  <div className={styles.graphContainer}>
                    <div className={styles.graph}>
                      <svg className={styles.graphLine} viewBox="0 0 200 80" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                          </linearGradient>
                        </defs>

                        {/* Área preenchida */}
                        <path
                          className={styles.graphArea}
                          d={generateAreaPath(account.graphData, maxValue)}
                        />

                        {/* Linha do gráfico */}
                        <path
                          className={styles.graphPath}
                          d={generateLinePath(account.graphData, maxValue)}
                          fill="none"
                        />
                      </svg>

                      {/* Pontos do gráfico */}
                      <div className={styles.graphPoints}>
                        {account.graphData.map((point, index) => {
                          const x = (index / (account.graphData.length - 1)) * 100;
                          const y = 100 - (point.value / maxValue) * 100;

                          return (
                            <div
                              key={index}
                              className={styles.graphPoint}
                              style={{
                                left: `${x}%`,
                                top: `${y}%`
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                    <div className={styles.graphLabels}>
                      {account.graphData.map((point, index) => (
                        <span key={index} className={styles.graphLabel}>
                          {point.date}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}