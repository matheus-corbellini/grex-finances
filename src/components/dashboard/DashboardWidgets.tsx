"use client";

import React, { useState, useEffect } from "react";
import styles from "./DashboardWidgets.module.css";
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, CreditCard, DollarSign } from "lucide-react";

export const DashboardWidgets: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className={styles.dashboardGrid}>
        {/* Placeholder widgets while loading */}
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className={styles.widgetCard}>
            <div className={styles.placeholderTitle} />
            <div className={styles.placeholderContent} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Desktop Layout */}
      <div className={styles.dashboardGrid}>
        {/* Saldo Geral Widget */}
        <div className={`${styles.widgetCard} ${styles.saldoGeralWidget}`}>
          <h3 className={styles.widgetTitle}>
            Saldo geral
          </h3>

          <div className={styles.balanceAmount}>
            R$24.542,00
          </div>

          <div className={styles.accountList}>
            {[
              { icon: "CN", name: "Caixa Lanchonete", value: "R$24.542,00" },
              { icon: "CN", name: "Conta corrente", value: "R$24.542,00" },
              { icon: "CN", name: "Caixa Lanchonete", value: "R$24.542,00" },
              { icon: "CN", name: "Conta corrente", value: "R$24.542,00" },
              { icon: "CN", name: "Caixa Lanchonete", value: "R$24.542,00" },
              { icon: "CN", name: "Conta corrente", value: "R$24.542,00" },
            ].map((item, index) => (
              <div key={index} className={styles.accountItem}>
                <div className={styles.accountIcon}>
                  {item.icon}
                </div>
                <div className={styles.accountInfo}>
                  <div className={styles.accountName}>
                    {item.name}
                  </div>
                  <div className={styles.accountBalance}>
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fluxo de Caixa Diário Widget */}
        <div className={`${styles.widgetCard} ${styles.fluxoCaixaWidget}`}>
          <h3 className={styles.widgetTitle}>
            Fluxo de Caixa Diário
          </h3>

          <div className={styles.chartContainer}>
            <div className={styles.chartBars}>
              {Array.from({ length: 7 }).map((_, index) => (
                <div key={index} className={styles.chartBar}>
                  <div className={styles.barContainer}>
                    <div
                      className={`${styles.bar} ${styles.barPositive}`}
                      style={{ height: `${(index * 7 + 20) % 60 + 20}px` }}
                    >
                      <div
                        className={`${styles.bar} ${styles.barNegative}`}
                        style={{ height: `${(index * 5 + 10) % 40 + 10}px` }}
                      />
                    </div>
                  </div>
                  <div className={styles.barLabel}>
                    09 jan
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contas para pagar Widget */}
        <div className={`${styles.widgetCard} ${styles.contasPagarWidget}`}>
          <h3 className={styles.widgetTitle}>
            Contas para pagar na semana
          </h3>

          <div className={styles.statsContainer}>
            <div className={`${styles.statsCircle} ${styles.orange}`}>
              9
            </div>
            <div className={styles.statsAmount}>
              R$25,23
            </div>
          </div>

          <button className={styles.resolveButton}>
            Resolver
          </button>
        </div>

        {/* Contas a receber Widget */}
        <div className={`${styles.widgetCard} ${styles.contasReceberWidget}`}>
          <h3 className={styles.widgetTitle}>
            Contas a receber na semana
          </h3>

          <div className={styles.statsContainer}>
            <div className={`${styles.statsCircle} ${styles.green}`}>
              123
            </div>
            <div className={styles.statsAmount}>
              R$1.825.238,23
            </div>
          </div>

          <button className={styles.resolveButton}>
            Resolver
          </button>
        </div>

        {/* Balanço do mês Widget */}
        <div className={`${styles.widgetCard} ${styles.balancoMesWidget}`}>
          <h3 className={styles.widgetTitle}>
            Balanço do mês
          </h3>

          <div className={styles.balanceProgress}>
            <div className={styles.progressItem}>
              <div className={styles.progressHeader}>
                <span className={styles.progressLabel}>Entradas</span>
                <span className={styles.progressValue}>R$24.542,00</span>
              </div>
              <div className={`${styles.progressBar} ${styles.progressBarPositive}`} />
            </div>

            <div className={styles.progressItem}>
              <div className={styles.progressHeader}>
                <span className={styles.progressLabel}>Entradas</span>
                <span className={styles.progressValue}>R$24.542,00</span>
              </div>
              <div className={`${styles.progressBar} ${styles.progressBarNegative}`} />
            </div>
          </div>
        </div>

        {/* Cartões de crédito Widget */}
        <div className={`${styles.widgetCard} ${styles.cartoesCreditoWidget}`}>
          <h3 className={styles.widgetTitle}>
            Cartões de crédito
          </h3>

          <div className={styles.cardList}>
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className={styles.cardItem}>
                <div className={styles.cardIcon}>
                  CN
                </div>
                <div className={styles.cardInfo}>
                  <div className={styles.cardName}>
                    Cartão de Crédito
                  </div>
                  <div className={styles.cardBalance}>
                    R$52.589,00
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top despesas Widget */}
        <div className={`${styles.widgetCard} ${styles.topDespesasWidget}`}>
          <h3 className={styles.widgetTitle}>
            Top despesas
          </h3>

          <div className={styles.expensesList}>
            {[
              { name: "Despesas Instituto", value: "R$-3.000,00", percentage: "45%" },
              { name: "Lorem Ipsum sit amet", value: "R$-3.000,00", percentage: "45%" },
              { name: "Despesas Instituto", value: "R$-3.000,00", percentage: "45%" },
              { name: "Lorem Ipsum sit amet", value: "R$-3.000,00", percentage: "45%" },
              { name: "Despesas Instituto", value: "R$-3.000,00", percentage: "45%" },
            ].map((item, index) => (
              <div key={index} className={styles.expenseItem}>
                <div className={styles.expenseNumber}>
                  {index + 1}
                </div>
                <div className={styles.expenseInfo}>
                  <div className={styles.expenseName}>
                    {item.name}
                  </div>
                  <div className={styles.expenseValue}>
                    {item.value}
                  </div>
                  <div className={styles.expensePercentage}>
                    {item.percentage}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className={styles.pagination}>
            <button className={styles.paginationButton}>
              <ChevronLeft size={12} />
            </button>
            <button className={`${styles.paginationButton} ${styles.paginationButtonActive}`}>
              1
            </button>
            <button className={styles.paginationButton}>
              2
            </button>
            <button className={styles.paginationButton}>
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className={styles.mobileContainer}>
        {/* Mobile Header Card */}
        <div className={styles.mobileHeaderCard}>
          <h3 className={styles.widgetTitle}>
            Saldo geral
          </h3>
          <div className={styles.balanceAmount}>
            R$24.542,00
          </div>
        </div>

        {/* Mobile Quick Actions */}
        <div className={styles.mobileQuickActions}>
          <div className={styles.mobileActionCard}>
            <div className={styles.mobileActionIcon}>
              <DollarSign size={24} />
            </div>
            <div className={styles.mobileActionTitle}>
              Receitas
            </div>
            <div className={styles.mobileActionAmount}>
              R$2.450,00
            </div>
          </div>
          <div className={styles.mobileActionCard}>
            <div className={styles.mobileActionIcon}>
              <CreditCard size={24} />
            </div>
            <div className={styles.mobileActionTitle}>
              Despesas
            </div>
            <div className={styles.mobileActionAmount}>
              R$1.200,00
            </div>
          </div>
        </div>

        {/* Mobile Balanço */}
        <div className={styles.mobileBalanco}>
          <div className={styles.mobileBalancoTitle}>
            Balanço do mês
          </div>
          <div className={styles.mobileBalancoAmount}>
            R$1.250,00
          </div>
        </div>

        {/* Mobile Cartões */}
        <div className={styles.mobileCartoes}>
          <div className={styles.mobileCartoesTitle}>
            Cartões de crédito
          </div>
          <div className={styles.mobileBalancoAmount}>
            R$850,00
          </div>
        </div>

        {/* Mobile Top Despesas */}
        <div className={styles.mobileTopDespesas}>
          <div className={styles.mobileTopDespesasTitle}>
            Top despesas
          </div>
          <div className={styles.mobileBalancoAmount}>
            R$450,00
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardWidgets;
