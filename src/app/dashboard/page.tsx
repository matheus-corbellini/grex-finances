"use client";

import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import styles from "./Dashboard.module.css";
import {
  MoreVertical,
  TrendingUp,
  TrendingDown,
  CreditCard,
  DollarSign,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Filter
} from "lucide-react";

const accounts = [
  { name: "Caixa Lanchonete", type: "Conta corrente", balance: "R$24.542,00", initials: "CN" },
  { name: "Caixa Lanchonete", type: "Conta corrente", balance: "R$24.542,00", initials: "CN" },
  { name: "Caixa Lanchonete", type: "Conta corrente", balance: "R$24.542,00", initials: "CN" },
  { name: "Caixa Lanchonete", type: "Conta corrente", balance: "R$24.542,00", initials: "CN" },
  { name: "Caixa Lanchonete", type: "Conta corrente", balance: "R$24.542,00", initials: "CN" },
  { name: "Caixa Lanchonete", type: "Conta corrente", balance: "R$24.542,00", initials: "CN" }
];

const creditCards = [
  { name: "Cartão de Crédito", balance: "R$52.589,00", initials: "CN" },
  { name: "Cartão de Crédito", balance: "R$52.589,00", initials: "CN" }
];

const topExpenses = [
  { name: "Despesas Instituto", amount: "R$-3.000,00", percentage: "45%" },
  { name: "Lorem Ipsum sit amet", amount: "R$-3.000,00", percentage: "45%" },
  { name: "Despesas Instituto", amount: "R$-3.000,00", percentage: "45%" },
  { name: "Lorem Ipsum sit amet", amount: "R$-3.000,00", percentage: "45%" },
  { name: "Despesas Instituto", amount: "R$-3.000,00", percentage: "45%" }
];

const monthlyBalance = {
  income: "R$24.542,00",
  expense: "R$24.542,00",
  result: "R$24.542,00"
};

const cashFlowData = [
  { date: "09 jan", income: 1200, expense: 800 },
  { date: "09 jan", income: 1500, expense: 900 },
  { date: "09 jan", income: 1800, expense: 1100 },
  { date: "09 jan", income: 1300, expense: 700 },
  { date: "09 jan", income: 1600, expense: 1000 },
  { date: "09 jan", income: 1400, expense: 850 },
  { date: "09 jan", income: 1700, expense: 950 },
  { date: "09 jan", income: 1900, expense: 0 }
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className={styles.container}>
        {/* Header com navegação de período */}
        <div className={styles.header}>
          <div className={styles.periodNavigation}>
            <button className={`${styles.periodButton} ${styles.active}`}>Mês</button>
            <button className={styles.periodButton}>Semana</button>
            <button className={styles.filterButton}>
              <Filter size={16} />
              Filtros
            </button>
          </div>
          <div className={styles.dateNavigation}>
            <button className={styles.dateButton}>
              <ArrowLeft size={16} />
            </button>
            <span className={styles.currentDate}>Julho de 2024</span>
            <button className={styles.dateButton}>
              <ArrowRight size={16} />
            </button>
            <button className={styles.dateButton}>
              <ChevronDown size={16} />
            </button>
          </div>
        </div>

        <div className={styles.mainContent}>
          {/* Conteúdo principal */}
          <div className={styles.content}>
            <div className={styles.grid}>
              {/* Sidebar interna com saldo geral e contas */}
              <div className={styles.sidebar}>
                {/* Card 1: Saldo Geral */}
                <div className={styles.sidebarCard}>
                  <div className={styles.sidebarCardHeader}>
                    <h3 className={styles.sidebarTitle}>Saldo geral</h3>
                    <button className={styles.sidebarMenuButton}>
                      <MoreVertical size={16} />
                    </button>
                  </div>
                  <div className={styles.sidebarBalance}>R$24.542,00</div>
                </div>

                {/* Card 2: Lista de Contas */}
                <div className={styles.sidebarCard}>
                  <div className={styles.accountsList}>
                    {accounts.map((account, index) => (
                      <div key={index} className={styles.accountItem}>
                        <div className={styles.accountIcon}>
                          {account.initials}
                        </div>
                        <div className={styles.accountDetails}>
                          <div className={styles.accountName}>{account.name}</div>
                          <div className={styles.accountType}>{account.type}</div>
                        </div>
                        <div className={styles.accountBalance}>{account.balance}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card 3: Balanço do Mês */}
                <div className={styles.sidebarCard}>
                  <div className={styles.sidebarCardHeader}>
                    <h3 className={styles.sidebarTitle}>Balanço do mês</h3>
                    <button className={styles.sidebarMenuButton}>
                      <MoreVertical size={16} />
                    </button>
                  </div>
                  <div className={styles.balanceItem}>
                    <div className={styles.balanceLabel}>Entradas</div>
                    <div className={styles.balanceValue}>{monthlyBalance.income}</div>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFillGreen} style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div className={styles.balanceItem}>
                    <div className={styles.balanceLabel}>Entradas</div>
                    <div className={styles.balanceValue}>{monthlyBalance.expense}</div>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFillRed} style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div className={styles.balanceResult}>
                    <div className={styles.balanceLabel}>Resultados do mês</div>
                    <div className={styles.balanceValueGreen}>{monthlyBalance.result}</div>
                  </div>
                </div>
              </div>

              {/* Área principal com cards */}
              <div className={styles.mainArea}>
                {/* Primeira linha: Fluxo de Caixa */}
                <div className={styles.firstRow}>
                  {/* Fluxo de Caixa Diário - Card Grande */}
                  <div className={styles.cardLarge}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardTitle}>Fluxo de Caixa Diário</h3>
                      <button className={styles.menuButton}>
                        <MoreVertical size={16} />
                      </button>
                    </div>
                    <div className={styles.chartContainer}>
                      <div className={styles.barChart}>
                        {cashFlowData.map((data, index) => (
                          <div key={index} className={styles.barContainer}>
                            <div className={styles.bar}>
                              <div
                                className={styles.barIncome}
                                style={{ height: `${(data.income / 1000) * 100}%` }}
                              ></div>
                              <div
                                className={styles.barExpense}
                                style={{ height: `${(data.expense / 1000) * 100}%` }}
                              ></div>
                            </div>
                            <div className={styles.barLabel}>{data.date}</div>
                          </div>
                        ))}
                      </div>
                      {/* Linha azul sobreposta */}
                      <div className={styles.lineChart}>
                        <svg className={styles.lineSvg} viewBox="0 0 100 100" preserveAspectRatio="none">
                          <path
                            d="M 0,80 Q 12.5,70 25,75 T 50,60 T 75,65 T 100,55"
                            fill="none"
                            stroke="#60a5fa"
                            strokeWidth="2"
                            className={styles.linePath}
                          />
                          {/* Pontos da linha */}
                          <circle cx="0" cy="80" r="2" fill="#60a5fa" />
                          <circle cx="12.5" cy="70" r="2" fill="#60a5fa" />
                          <circle cx="25" cy="75" r="2" fill="#60a5fa" />
                          <circle cx="37.5" cy="67" r="2" fill="#60a5fa" />
                          <circle cx="50" cy="60" r="2" fill="#60a5fa" />
                          <circle cx="62.5" cy="62" r="2" fill="#60a5fa" />
                          <circle cx="75" cy="65" r="2" fill="#60a5fa" />
                          <circle cx="87.5" cy="60" r="2" fill="#60a5fa" />
                          <circle cx="100" cy="55" r="2" fill="#60a5fa" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Segunda linha: Contas embaixo do Fluxo de Caixa */}
                <div className={styles.secondRow}>
                  {/* Contas para pagar na semana - Card Pequeno */}
                  <div className={styles.cardSmall}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardTitle}>Contas para pagar na semana</h3>
                      <button className={styles.menuButton}>
                        <MoreVertical size={16} />
                      </button>
                    </div>
                    <div className={styles.billsContent}>
                      <div className={styles.billsSummary}>
                        <div className={styles.billsCircle}>
                          <span className={styles.billsNumber}>9</span>
                        </div>
                        <div className={styles.billsAmount}>R$25,23</div>
                      </div>
                      <button className={styles.resolveButton}>Resolver</button>
                    </div>
                  </div>

                  {/* Contas a receber na semana - Card Pequeno */}
                  <div className={styles.cardSmall}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardTitle}>Contas a receber na semana</h3>
                      <button className={styles.menuButton}>
                        <MoreVertical size={16} />
                      </button>
                    </div>
                    <div className={styles.billsContent}>
                      <div className={styles.billsSummary}>
                        <div className={styles.billsCircleGreen}>
                          <span className={styles.billsNumber}>123</span>
                        </div>
                        <div className={styles.billsAmount}>R$1.825.238,23</div>
                      </div>
                      <button className={styles.resolveButton}>Resolver</button>
                    </div>
                  </div>
                </div>

                {/* Terceira linha: Top despesas + Cartões de crédito */}
                <div className={styles.thirdRow}>
                  {/* Top despesas - Card Grande */}
                  <div className={styles.cardLarge}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardTitle}>Top despesas</h3>
                      <button className={styles.menuButton}>
                        <MoreVertical size={16} />
                      </button>
                    </div>
                    <div className={styles.expensesList}>
                      {topExpenses.map((expense, index) => (
                        <div key={index} className={styles.expenseItem}>
                          <div className={styles.expenseNumber}>{index + 1}</div>
                          <div className={styles.expenseInfo}>
                            <div className={styles.expenseName}>{expense.name}</div>
                            <div className={styles.expenseAmount}>
                              {expense.amount}
                              <span className={styles.expensePercentage}>{expense.percentage}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.pagination}>
                      <button className={styles.paginationButton}>
                        <ArrowLeft size={16} />
                      </button>
                      <div className={styles.paginationDots}>
                        <div className={`${styles.paginationDot} ${styles.active}`}></div>
                        <div className={styles.paginationDot}></div>
                        <div className={styles.paginationDot}></div>
                      </div>
                      <button className={styles.paginationButton}>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Cartões de crédito - Card Pequeno */}
                  <div className={styles.cardSmallShort}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardTitle}>Cartões de crédito</h3>
                      <button className={styles.menuButton}>
                        <MoreVertical size={16} />
                      </button>
                    </div>
                    <div className={styles.creditCardsList}>
                      {creditCards.map((card, index) => (
                        <div key={index} className={styles.creditCardItem}>
                          <div className={styles.creditCardIcon}>
                            {card.initials}
                          </div>
                          <div className={styles.creditCardDetails}>
                            <div className={styles.creditCardName}>{card.name}</div>
                            <div className={styles.creditCardBalance}>{card.balance}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}