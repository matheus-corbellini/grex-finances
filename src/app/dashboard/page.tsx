"use client"

import React, { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import styles from "./Dashboard.module.css";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"
import { TransactionViewModal, AccountDetailsModal } from "../../components/modals";
import { CategoryType } from "../../../shared/types/category.types";
import { TransactionType } from "../../../shared/types/transaction.types";
import dashboardService, { DashboardData, CashFlowData, TopExpense, BillsSummary, CreditCardSummary } from "../../services/api/dashboard.service";

export default function Dashboard() {
  const [showTransactionViewModal, setShowTransactionViewModal] = useState(false);
  const [showAccountDetailsModal, setShowAccountDetailsModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);

  // Estados para dados do dashboard
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPeriod, setCurrentPeriod] = useState<'week' | 'month'>('month');

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getDashboardData(currentPeriod);
      setDashboardData(data);
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
      setError('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  }, [currentPeriod]);

  // Carregar dados do dashboard
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Função para formatar valores monetários
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Função para formatar valores nos gráficos (versão compacta)
  const formatChartValue = (value: number): string => {
    if (Math.abs(value) >= 1000000) {
      return `R$ ${(value / 1000000).toFixed(1)}M`;
    } else if (Math.abs(value) >= 1000) {
      return `R$ ${(value / 1000).toFixed(0)}k`;
    } else {
      return `R$ ${value.toFixed(0)}`;
    }
  };

  // Função para formatar datas
  const formatDate = (dateString: string): string => {
    try {
      if (!dateString) return '';

      const date = new Date(dateString);

      // Verificar se a data é válida
      if (isNaN(date.getTime())) {
        return '';
      }

      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short'
      });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return '';
    }
  };

  const handleViewTransaction = (transaction: any) => {
    setSelectedTransaction(transaction);
    setShowTransactionViewModal(true);
  };

  const handleViewAccount = (account: any) => {
    setSelectedAccount(account);
    setShowAccountDetailsModal(true);
  };

  const handleCloseTransactionModal = () => {
    setShowTransactionViewModal(false);
    setSelectedTransaction(null);
  };

  const handleCloseAccountModal = () => {
    setShowAccountDetailsModal(false);
    setSelectedAccount(null);
  };

  const handleEditTransaction = () => {
    console.log("Editar transação:", selectedTransaction);
  };

  const handleDeleteTransaction = () => {
    console.log("Excluir transação:", selectedTransaction);
  };

  const handleDuplicateTransaction = () => {
    console.log("Duplicar transação:", selectedTransaction);
  };

  const handleShareTransaction = () => {
    console.log("Compartilhar transação:", selectedTransaction);
  };

  const handleEditAccount = () => {
    console.log("Editar conta:", selectedAccount);
  };

  const handleDeleteAccount = () => {
    console.log("Excluir conta:", selectedAccount);
  };

  const handleExportAccount = () => {
    console.log("Exportar conta:", selectedAccount);
  };

  const handleShareAccount = () => {
    console.log("Compartilhar conta:", selectedAccount);
  };

  // Se estiver carregando, mostrar loading
  if (loading) {
    return (
      <DashboardLayout>
        <div className={styles.container}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
            fontSize: '18px',
            color: '#6b7280'
          }}>
            Carregando dados do dashboard...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Se houver erro, mostrar erro
  if (error) {
    return (
      <DashboardLayout>
        <div className={styles.container}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
            fontSize: '18px',
            color: '#ef4444'
          }}>
            {error}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Se não há dados, não renderizar
  if (!dashboardData) {
    return null;
  }

  // Validar dados críticos
  const safeDashboardData = {
    ...dashboardData,
    summary: {
      totalBalance: isNaN(dashboardData.summary.totalBalance) ? 0 : dashboardData.summary.totalBalance,
      monthlyIncome: isNaN(dashboardData.summary.monthlyIncome) ? 0 : dashboardData.summary.monthlyIncome,
      monthlyExpenses: isNaN(dashboardData.summary.monthlyExpenses) ? 0 : dashboardData.summary.monthlyExpenses,
      monthlyResult: isNaN(dashboardData.summary.monthlyResult) ? 0 : dashboardData.summary.monthlyResult,
      accountsCount: dashboardData.summary.accountsCount || 0
    },
    accounts: Array.isArray(dashboardData.accounts) ? dashboardData.accounts : [],
    cashFlowData: Array.isArray(dashboardData.cashFlowData) ? dashboardData.cashFlowData : [],
    topExpenses: Array.isArray(dashboardData.topExpenses) ? dashboardData.topExpenses : [],
    billsSummary: {
      billsToPay: {
        count: dashboardData.billsSummary?.billsToPay?.count || 0,
        amount: isNaN(dashboardData.billsSummary?.billsToPay?.amount) ? 0 : dashboardData.billsSummary.billsToPay.amount
      },
      billsToReceive: {
        count: dashboardData.billsSummary?.billsToReceive?.count || 0,
        amount: isNaN(dashboardData.billsSummary?.billsToReceive?.amount) ? 0 : dashboardData.billsSummary.billsToReceive.amount
      }
    },
    creditCards: Array.isArray(dashboardData.creditCards) ? dashboardData.creditCards : []
  };

  return (
    <DashboardLayout>
      <div className={styles.container}>
        {/* Header com navegação de período */}
        <div className={styles.header}>
          <div className={styles.periodNavigation}>
            <button
              className={`${styles.periodButton} ${currentPeriod === 'month' ? styles.active : ''}`}
              onClick={() => setCurrentPeriod('month')}
            >
              Mês
            </button>
            <button
              className={`${styles.periodButton} ${currentPeriod === 'week' ? styles.active : ''}`}
              onClick={() => setCurrentPeriod('week')}
            >
              Semana
            </button>
            <button className={styles.filterButton}>
              <ChevronDown size={16} />
              Filtros
            </button>
          </div>
          <div className={styles.dateNavigation}>
            <button className={styles.dateButton}>
              <ChevronLeft size={16} />
            </button>
            <span className={styles.currentDate}>
              {currentPeriod === 'month' ? 'Julho de 2024' : 'Semana atual'}
            </span>
            <button className={styles.dateButton}>
              <ChevronRight size={16} />
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
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                  <div className={styles.sidebarBalance}>
                    {formatCurrency(safeDashboardData.summary.totalBalance)}
                  </div>
                </div>

                {/* Card 2: Lista de Contas */}
                <div className={styles.sidebarCard}>
                  <div className={styles.accountsList}>
                    {safeDashboardData.accounts.slice(0, 6).map((account, index) => (
                      <div key={account.id || index} className={styles.accountItem}>
                        <div className={styles.accountIcon}>
                          {account.name.charAt(0).toUpperCase()}
                        </div>
                        <div className={styles.accountDetails}>
                          <div className={styles.accountName}>{account.name}</div>
                          <div className={styles.accountType}>{account.type?.name || 'Conta'}</div>
                        </div>
                        <div className={styles.accountBalance}>
                          {formatCurrency(account.balance)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card 3: Balanço do Mês */}
                <div className={styles.sidebarCard}>
                  <div className={styles.sidebarCardHeader}>
                    <h3 className={styles.sidebarTitle}>Balanço do mês</h3>
                    <button className={styles.sidebarMenuButton}>
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                  <div className={styles.balanceItem}>
                    <div className={styles.balanceLabel}>Entradas</div>
                    <div className={styles.balanceValue}>
                      {formatCurrency(safeDashboardData.summary.monthlyIncome)}
                    </div>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFillGreen}
                        style={{
                          width: `${Math.min(100, (safeDashboardData.summary.monthlyIncome / Math.max(safeDashboardData.summary.monthlyIncome + safeDashboardData.summary.monthlyExpenses, 1)) * 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className={styles.balanceItem}>
                    <div className={styles.balanceLabel}>Saídas</div>
                    <div className={styles.balanceValue}>
                      {formatCurrency(safeDashboardData.summary.monthlyExpenses)}
                    </div>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFillRed}
                        style={{
                          width: `${Math.min(100, (safeDashboardData.summary.monthlyExpenses / Math.max(safeDashboardData.summary.monthlyIncome + safeDashboardData.summary.monthlyExpenses, 1)) * 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className={styles.balanceResult}>
                    <div className={styles.balanceLabel}>Resultados do mês</div>
                    <div className={`${styles.balanceValue} ${safeDashboardData.summary.monthlyResult >= 0 ? styles.balanceValueGreen : styles.balanceValueRed}`}>
                      {formatCurrency(safeDashboardData.summary.monthlyResult)}
                    </div>
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
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                    <div className={styles.chartContainer}>
                      {/* Gráfico de linha (área superior) */}
                      <div className={styles.lineChartSection}>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={safeDashboardData.cashFlowData} margin={{ top: 10, right: 10, left: 40, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.8} />
                                <stop offset="50%" stopColor="#93c5fd" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#dbeafe" stopOpacity={0.1} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="0" stroke="#f3f4f6" vertical={false} />
                            <XAxis
                              dataKey="date"
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: "#9ca3af", fontSize: 11 }}
                              dy={10}
                              tickFormatter={formatDate}
                            />
                            <YAxis
                              domain={['auto', 'auto']}
                              tickCount={5}
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: "#9ca3af", fontSize: 11 }}
                              width={35}
                              tickFormatter={formatChartValue}
                            />
                            <Area
                              type="monotone"
                              dataKey="flow"
                              stroke="#60a5fa"
                              strokeWidth={2}
                              fill="url(#colorFlow)"
                              dot={(props: any) => {
                                const { cx, cy, index } = props
                                // Mostrar pontos apenas no início e fim
                                if (index === 0 || index === safeDashboardData.cashFlowData.length - 1) {
                                  return <circle key={`dot-${index}`} cx={cx} cy={cy} r={4} fill="#60a5fa" stroke="#fff" strokeWidth={2} />
                                }
                                return null
                              }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Gráfico de barras (área inferior) */}
                      <div className={styles.barChartSection}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={safeDashboardData.cashFlowData} margin={{ top: 10, right: 10, left: 40, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="0" stroke="#f3f4f6" vertical={false} />
                            <XAxis
                              dataKey="date"
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: "#9ca3af", fontSize: 11 }}
                              dy={10}
                              tickFormatter={formatDate}
                            />
                            <YAxis
                              domain={['auto', 'auto']}
                              tickCount={5}
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: "#9ca3af", fontSize: 11 }}
                              width={35}
                              tickFormatter={formatChartValue}
                            />
                            <Bar dataKey="positive" fill="#5FD68A" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="negative" fill="#F87171" radius={[0, 0, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
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
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                    <div className={styles.billsContent}>
                      <div className={styles.billsSummary}>
                        <div className={styles.billsCircle}>
                          <span className={styles.billsNumber}>{safeDashboardData.billsSummary.billsToPay.count}</span>
                        </div>
                        <div className={styles.billsAmount}>
                          {formatCurrency(safeDashboardData.billsSummary.billsToPay.amount)}
                        </div>
                      </div>
                      <button className={styles.resolveButton}>Resolver</button>
                    </div>
                  </div>

                  {/* Contas a receber na semana - Card Pequeno */}
                  <div className={styles.cardSmall}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardTitle}>Contas a receber na semana</h3>
                      <button className={styles.menuButton}>
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                    <div className={styles.billsContent}>
                      <div className={styles.billsSummary}>
                        <div className={styles.billsCircleGreen}>
                          <span className={styles.billsNumber}>{safeDashboardData.billsSummary.billsToReceive.count}</span>
                        </div>
                        <div className={styles.billsAmount}>
                          {formatCurrency(safeDashboardData.billsSummary.billsToReceive.amount)}
                        </div>
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
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                    <div className={styles.expensesList}>
                      {safeDashboardData.topExpenses.map((expense, index) => (
                        <div key={index} className={styles.expenseItem}>
                          <div className={styles.expenseNumber}>{expense.position}</div>
                          <div className={styles.expenseInfo}>
                            <div className={styles.expenseName}>{expense.name}</div>
                            <div className={styles.expenseAmount}>
                              {formatCurrency(expense.amount)}
                              <span className={styles.expensePercentage}>{expense.percentage}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.pagination}>
                      <button className={styles.paginationButton}>
                        <ChevronLeft size={16} />
                      </button>
                      <div className={styles.paginationDots}>
                        <div className={`${styles.paginationDot} ${styles.active}`}></div>
                        <div className={styles.paginationDot}></div>
                        <div className={styles.paginationDot}></div>
                      </div>
                      <button className={styles.paginationButton}>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Cartões de crédito - Card Pequeno */}
                  <div className={styles.cardSmallShort}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardTitle}>Cartões de crédito</h3>
                      <button className={styles.menuButton}>
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                    <div className={styles.creditCardsList}>
                      {safeDashboardData.creditCards.map((card, index) => (
                        <div key={index} className={styles.creditCardItem}>
                          <div className={styles.creditCardIcon}>
                            {card.name.charAt(0).toUpperCase()}
                          </div>
                          <div className={styles.creditCardDetails}>
                            <div className={styles.creditCardName}>{card.name}</div>
                            <div className={styles.creditCardBalance}>
                              {formatCurrency(card.used)} / {formatCurrency(card.limit)}
                            </div>
                            <div className={styles.creditCardBalance}>
                              Disponível: {formatCurrency(card.available)}
                            </div>
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

      {/* Modal de visualização de transação */}
      {selectedTransaction && (
        <TransactionViewModal
          isOpen={showTransactionViewModal}
          onClose={handleCloseTransactionModal}
          transaction={selectedTransaction}
          account={{
            id: "1",
            userId: "1",
            name: "Conta Principal",
            type: {
              id: "1",
              name: "Conta Corrente",
              category: "checking" as any
            },
            balance: 10000,
            currency: "BRL",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }}
          category={{
            id: "1",
            name: "Despesas",
            type: CategoryType.EXPENSE,
            color: "#ef4444",
            icon: "tag",
            isDefault: false,
            order: 1,
            createdAt: new Date(),
            updatedAt: new Date()
          }}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
          onDuplicate={handleDuplicateTransaction}
          onShare={handleShareTransaction}
        />
      )}

      {/* Modal de detalhes da conta */}
      {selectedAccount && (
        <AccountDetailsModal
          isOpen={showAccountDetailsModal}
          onClose={handleCloseAccountModal}
          account={{
            id: "1",
            userId: "1",
            name: selectedAccount.name,
            type: {
              id: "1",
              name: "Cartão de Crédito",
              category: "credit_card" as any
            },
            balance: parseFloat(selectedAccount.balance.replace(/[^\d,-]/g, '').replace(',', '.')),
            currency: "BRL",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }}
          accountType={{
            id: "1",
            name: "Cartão de Crédito",
            category: "credit_card" as any,
            description: "Cartão de crédito bancário",
            icon: "credit-card"
          }}
          recentTransactions={[
            {
              id: "1",
              userId: "1",
              accountId: "1",
              description: "Compra no cartão",
              amount: -500,
              type: TransactionType.EXPENSE,
              status: "completed" as any,
              date: new Date(),
              isRecurring: false,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ]}
          balanceHistory={[
            { date: new Date(), balance: 50000 },
            { date: new Date(), balance: 52000 }
          ]}
          onEdit={handleEditAccount}
          onDelete={handleDeleteAccount}
          onExport={handleExportAccount}
          onShare={handleShareAccount}
        />
      )}
    </DashboardLayout>
  );
}