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
  ChevronDown
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

const cashFlowData = [
  { date: "09 jan", income: 1200, expense: 800 },
  { date: "10 jan", income: 1500, expense: 900 },
  { date: "11 jan", income: 1800, expense: 1100 },
  { date: "12 jan", income: 1300, expense: 700 },
  { date: "13 jan", income: 1600, expense: 1000 },
  { date: "14 jan", income: 1400, expense: 850 },
  { date: "15 jan", income: 1700, expense: 950 },
  { date: "16 jan", income: 1900, expense: 1200 }
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Saldo Geral */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Saldo geral</h3>
              <button className={styles.menuButton}>
                <MoreVertical size={16} />
              </button>
            </div>
            <div className={styles.balanceAmount}>R$24.542,00</div>
            <div className={styles.accountsList}>
              {accounts.map((account, index) => (
                <div key={index} className={styles.accountItem}>
                  <div className={styles.accountInfo}>
                    <div className={styles.accountIcon}>
                      {account.initials}
                    </div>
                    <div className={styles.accountDetails}>
                      <div className={styles.accountName}>{account.name}</div>
                      <div className={styles.accountType}>{account.type}</div>
                    </div>
                  </div>
                  <div className={styles.accountBalance}>{account.balance}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Fluxo de Caixa Diário */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                Fluxo de Caixa Diário
                <ChevronDown size={16} className={styles.dropdownIcon} />
              </h3>
              <button className={styles.menuButton}>
                <MoreVertical size={16} />
              </button>
            </div>
            <div className={styles.chartContainer}>
              <div className={styles.lineChart}>
                <svg viewBox="0 0 300 100" className={styles.chartSvg}>
                  <defs>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <path
                    d="M 10,80 Q 50,60 90,50 T 170,40 T 250,30 T 290,20"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    className={styles.linePath}
                  />
                  <path
                    d="M 10,80 Q 50,60 90,50 T 170,40 T 250,30 T 290,20 L 290,100 L 10,100 Z"
                    fill="url(#areaGradient)"
                    className={styles.areaPath}
                  />
                  <circle cx="10" cy="80" r="3" fill="#3b82f6" />
                  <circle cx="50" cy="60" r="3" fill="#3b82f6" />
                  <circle cx="90" cy="50" r="3" fill="#3b82f6" />
                  <circle cx="130" cy="45" r="3" fill="#3b82f6" />
                  <circle cx="170" cy="40" r="3" fill="#3b82f6" />
                  <circle cx="210" cy="35" r="3" fill="#3b82f6" />
                  <circle cx="250" cy="30" r="3" fill="#3b82f6" />
                  <circle cx="290" cy="20" r="3" fill="#3b82f6" />
                </svg>
              </div>
              <div className={styles.barChart}>
                {cashFlowData.map((data, index) => (
                  <div key={index} className={styles.barContainer}>
                    <div className={styles.bar}>
                      <div 
                        className={styles.barIncome} 
                        style={{ height: `${(data.income / 2000) * 100}%` }}
                      ></div>
                      <div 
                        className={styles.barExpense} 
                        style={{ height: `${(data.expense / 2000) * 100}%` }}
                      ></div>
                    </div>
                    <div className={styles.barLabel}>{data.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contas para pagar na semana */}
          <div className={styles.card}>
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

          {/* Contas a receber na semana */}
          <div className={styles.card}>
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

          {/* Balanço do mês */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Balanço do mês</h3>
              <button className={styles.menuButton}>
                <MoreVertical size={16} />
              </button>
            </div>
            <div className={styles.balanceContent}>
              <div className={styles.balanceItem}>
                <div className={styles.balanceLabel}>Entradas</div>
                <div className={styles.balanceValue}>R$24.542,00</div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFillGreen} style={{ width: '90%' }}></div>
                </div>
              </div>
              <div className={styles.balanceItem}>
                <div className={styles.balanceLabel}>Saídas</div>
                <div className={styles.balanceValue}>R$24.542,00</div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFillRed} style={{ width: '50%' }}></div>
                </div>
              </div>
              <div className={styles.balanceResult}>
                <div className={styles.balanceLabel}>Resultados do mês</div>
                <div className={styles.balanceValueGreen}>R$24.542,00</div>
              </div>
            </div>
          </div>

          {/* Cartões de crédito */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Cartões de crédito</h3>
              <button className={styles.menuButton}>
                <MoreVertical size={16} />
              </button>
            </div>
            <div className={styles.creditCardsList}>
              {creditCards.map((card, index) => (
                <div key={index} className={styles.creditCardItem}>
                  <div className={styles.creditCardInfo}>
                    <div className={styles.creditCardIcon}>
                      {card.initials}
                    </div>
                    <div className={styles.creditCardDetails}>
                      <div className={styles.creditCardName}>{card.name}</div>
                      <div className={styles.creditCardBalance}>{card.balance}</div>
                      <div className={styles.creditCardBalanceSecondary}>{card.balance}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top despesas */}
          <div className={styles.card}>
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
                <span className={styles.paginationDot}></span>
                <span className={`${styles.paginationDot} ${styles.active}`}></span>
                <span className={styles.paginationDot}></span>
              </div>
              <button className={styles.paginationButton}>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}