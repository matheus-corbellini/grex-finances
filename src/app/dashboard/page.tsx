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
        </div>
      </div>
    </DashboardLayout>
  );
}