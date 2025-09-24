"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { ChevronLeft, ChevronRight, Plus, TrendingUp, TrendingDown, Eye } from "lucide-react";
import { BankIconComponent } from "../../../components/ui/BankIcons";
import { AccountDetailsModal, AddAccountModal } from "../../../components/modals";
import { Icon } from "../../../components/ui/Icon";
import { TransactionType, TransactionStatus } from "../../../../shared/types/transaction.types";
import accountsService, { CreateAccountDto, Account as ApiAccount } from "../../../services/api/accounts.service";
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
  const [showAccountDetailsModal, setShowAccountDetailsModal] = useState(false);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<ApiAccount | null>(null);
  const [accounts, setAccounts] = useState<ApiAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'filters'>('month');
  const [showFilters, setShowFilters] = useState(false);
  const [balanceHistory, setBalanceHistory] = useState<Record<string, Array<{ date: string; balance: number }>>>({});
  const [recentTransactions, setRecentTransactions] = useState<Record<string, any[]>>({});
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    minBalance: '',
    maxBalance: ''
  });
  const [filteredAccounts, setFilteredAccounts] = useState<ApiAccount[]>([]);

  // Carregar histórico de saldos para uma conta
  const loadBalanceHistory = async (accountId: string) => {
    try {
      const history = await accountsService.getBalanceHistory(accountId, {
        startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString(),
        endDate: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString(),
        period: viewMode === 'week' ? 'daily' : 'daily'
      });

      setBalanceHistory(prev => ({
        ...prev,
        [accountId]: history.history
      }));
    } catch (err: any) {
      console.error("Erro ao carregar histórico de saldos:", err);
      // Em caso de erro, usar dados mockados
      const mockData = [
        { date: "01", balance: 1000 },
        { date: "05", balance: 1200 },
        { date: "10", balance: 1100 },
        { date: "15", balance: 1300 },
        { date: "20", balance: 1250 },
        { date: "25", balance: 1400 },
        { date: "30", balance: 1350 }
      ];
      setBalanceHistory(prev => ({
        ...prev,
        [accountId]: mockData
      }));
    }
  };

  // Carregar transações recentes para uma conta
  const loadRecentTransactions = async (accountId: string) => {
    try {
      const transactions = await accountsService.getAccountTransactions(accountId, {
        page: 1,
        limit: 5,
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Últimos 30 dias
        endDate: new Date().toISOString()
      });

      setRecentTransactions(prev => ({
        ...prev,
        [accountId]: transactions.transactions
      }));
    } catch (err: any) {
      console.error("Erro ao carregar transações:", err);
      // Em caso de erro, usar dados mockados
      const mockTransactions = [
        {
          id: "1",
          description: "Transferência recebida",
          amount: 1000,
          type: "income",
          status: "completed",
          date: new Date().toISOString(),
          isRecurring: false
        },
        {
          id: "2",
          description: "Pagamento de conta",
          amount: -150,
          type: "expense",
          status: "completed",
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          isRecurring: false
        }
      ];
      setRecentTransactions(prev => ({
        ...prev,
        [accountId]: mockTransactions
      }));
    }
  };

  // Carregar contas da API
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const accountsData = await accountsService.getAccounts();
        setAccounts(accountsData);

        // Carregar histórico de saldos e transações para cada conta
        for (const account of accountsData) {
          await Promise.all([
            loadBalanceHistory(account.id),
            loadRecentTransactions(account.id)
          ]);
        }
      } catch (err: any) {
        console.error("Erro ao carregar contas:", err);
        setError(err.message || "Erro ao carregar contas");
      } finally {
        setIsLoading(false);
      }
    };

    loadAccounts();
  }, [currentDate, viewMode]);

  const formatDate = (date: Date) => {
    if (viewMode === 'week') {
      const startOfWeek = new Date(date);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
      startOfWeek.setDate(diff);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      return `${startOfWeek.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} - ${endOfWeek.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
    } else {
      return date.toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric'
      });
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
    } else if (viewMode === 'week') {
      if (direction === 'prev') {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setDate(newDate.getDate() + 7);
      }
    }
    setCurrentDate(newDate);
  };

  const handleViewModeChange = (mode: 'month' | 'week' | 'filters') => {
    setViewMode(mode);
    if (mode === 'filters') {
      setShowFilters(!showFilters);
    } else {
      setShowFilters(false);
    }
  };

  // Aplicar filtros às contas
  const applyFilters = () => {
    let filtered = [...accounts];

    if (filters.type) {
      filtered = filtered.filter(account => account.type.category === filters.type);
    }

    if (filters.status) {
      if (filters.status === 'active') {
        filtered = filtered.filter(account => account.isActive && !account.isArchived);
      } else if (filters.status === 'inactive') {
        filtered = filtered.filter(account => !account.isActive);
      } else if (filters.status === 'archived') {
        filtered = filtered.filter(account => account.isArchived);
      }
    }

    if (filters.minBalance) {
      const minBalance = parseFloat(filters.minBalance);
      filtered = filtered.filter(account => account.balance >= minBalance);
    }

    if (filters.maxBalance) {
      const maxBalance = parseFloat(filters.maxBalance);
      filtered = filtered.filter(account => account.balance <= maxBalance);
    }

    setFilteredAccounts(filtered);
    setShowFilters(false);
  };

  // Limpar filtros
  const clearFilters = () => {
    setFilters({
      type: '',
      status: '',
      minBalance: '',
      maxBalance: ''
    });
    setFilteredAccounts([]);
    setShowFilters(false);
  };

  // Atualizar contas filtradas quando contas ou filtros mudarem
  useEffect(() => {
    if (Object.values(filters).some(filter => filter !== '')) {
      applyFilters();
    } else {
      setFilteredAccounts([]);
    }
  }, [accounts, filters]);

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

  const handleViewAccount = (account: ApiAccount) => {
    setSelectedAccount(account);
    setShowAccountDetailsModal(true);
  };

  const handleCloseAccountModal = () => {
    setShowAccountDetailsModal(false);
    setSelectedAccount(null);
  };

  const handleEditAccount = async () => {
    if (!selectedAccount) return;

    try {
      // Aqui você pode abrir um modal de edição ou navegar para uma página de edição

      // Exemplo de como seria a chamada da API:
      // const updatedAccount = await accountsService.updateAccount(selectedAccount.id, updateData);
      // setAccounts(prev => prev.map(acc => acc.id === selectedAccount.id ? updatedAccount : acc));

      alert("Funcionalidade de edição será implementada em breve!");
    } catch (error: any) {
      console.error("Erro ao editar conta:", error);
      alert("Erro ao editar conta: " + error.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!selectedAccount) return;

    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir a conta "${selectedAccount.name}"?\n\nEsta ação não pode ser desfeita.`
    );

    if (!confirmDelete) return;

    try {
      await accountsService.deleteAccount(selectedAccount.id);

      // Remover a conta da lista local
      setAccounts(prev => prev.filter(acc => acc.id !== selectedAccount.id));

      // Fechar o modal
      setShowAccountDetailsModal(false);
      setSelectedAccount(null);

      alert("Conta excluída com sucesso!");
    } catch (error: any) {
      console.error("Erro ao excluir conta:", error);
      alert("Erro ao excluir conta: " + error.message);
    }
  };

  const handleExportAccount = async () => {
    if (!selectedAccount) return;

    try {
      // Criar dados para exportação
      const exportData = {
        account: selectedAccount,
        exportDate: new Date().toISOString(),
        format: 'json'
      };

      // Criar e baixar arquivo
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `conta-${selectedAccount.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert("Conta exportada com sucesso!");
    } catch (error: any) {
      console.error("Erro ao exportar conta:", error);
      alert("Erro ao exportar conta: " + error.message);
    }
  };

  const handleShareAccount = async () => {
    if (!selectedAccount) return;

    try {
      // Criar dados para compartilhamento
      const shareData = {
        title: `Conta: ${selectedAccount.name}`,
        text: `Saldo atual: R$ ${selectedAccount.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        url: window.location.href
      };

      // Tentar usar Web Share API se disponível
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copiar para clipboard
        const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
        await navigator.clipboard.writeText(shareText);
        alert("Informações da conta copiadas para a área de transferência!");
      }
    } catch (error: any) {
      console.error("Erro ao compartilhar conta:", error);
      alert("Erro ao compartilhar conta: " + error.message);
    }
  };

  const handleAccountAction = async (account: ApiAccount, action: string) => {
    try {
      switch (action) {
        case 'conciliar':
          // Implementar lógica de conciliação
          alert("Funcionalidade de conciliação será implementada em breve!");
          break;

        case 'regularizar':
          // Implementar lógica de regularização
          alert("Funcionalidade de regularização será implementada em breve!");
          break;

        case 'revisar':
          // Implementar lógica de revisão
          alert("Funcionalidade de revisão será implementada em breve!");
          break;

        case 'ajustar':
          // Implementar lógica de ajuste
          alert("Funcionalidade de ajuste será implementada em breve!");
          break;

        case 'analisar':
          // Implementar lógica de análise
          alert("Funcionalidade de análise será implementada em breve!");
          break;

        case 'fechar':
          // Implementar lógica de fechamento
          alert("Funcionalidade de fechamento será implementada em breve!");
          break;

        default:
      }
    } catch (error: any) {
      console.error("Erro ao executar ação:", error);
      alert("Erro ao executar ação: " + error.message);
    }
  };

  const handleAddAccount = async (accountData: CreateAccountDto) => {
    try {

      // Chamar API para criar conta
      const newAccount = await accountsService.createAccount(accountData);

      // Atualizar a lista de contas
      setAccounts(prev => [...prev, newAccount]);

      // Mostrar mensagem de sucesso
      alert("Conta adicionada com sucesso!");

    } catch (error: any) {
      console.error("Erro detalhado ao criar conta:", error);
      console.error("Erro response:", error.response);
      console.error("Erro message:", error.message);
      alert(`Erro ao adicionar conta: ${error.message}`);
      throw new Error(error.message || "Erro ao adicionar conta");
    }
  };

  return (
    <DashboardLayout>
      <div className={styles.accountsContainer}>
        {/* Barra de controles superior */}
        <div className={styles.controlsBar}>
          <div className={styles.leftControls}>
            <div className={styles.viewButtons}>
              <button
                className={`${styles.viewButton} ${viewMode === 'month' ? styles.active : ''}`}
                onClick={() => handleViewModeChange('month')}
              >
                Mês
              </button>
              <button
                className={`${styles.viewButton} ${viewMode === 'week' ? styles.active : ''}`}
                onClick={() => handleViewModeChange('week')}
              >
                Semana
              </button>
              <button
                className={`${styles.viewButton} ${viewMode === 'filters' ? styles.active : ''}`}
                onClick={() => handleViewModeChange('filters')}
              >
                Filtros
              </button>
            </div>

            {/* Botão Adicionar Conta */}
            <button
              className={styles.addAccountButton}
              onClick={() => setShowAddAccountModal(true)}
            >
              <Plus size={16} />
              Adicionar Conta
            </button>
          </div>

          <div className={styles.rightControls}>
            <div className={styles.dateNavigation}>
              <button
                className={styles.dateButton}
                onClick={() => navigateDate('prev')}
              >
                <ChevronLeft size={16} />
              </button>
              <span className={styles.currentDate}>
                {formatDate(currentDate)}
              </span>
              <button
                className={styles.dateButton}
                onClick={() => navigateDate('next')}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Painel de filtros */}
        {showFilters && (
          <div className={styles.filtersPanel}>
            <div className={styles.filtersContent}>
              <h3 className={styles.filtersTitle}>Filtros</h3>
              <div className={styles.filtersGrid}>
                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Tipo de Conta</label>
                  <select
                    className={styles.filterSelect}
                    value={filters.type}
                    onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                  >
                    <option value="">Todos os tipos</option>
                    <option value="checking">Conta Corrente</option>
                    <option value="savings">Poupança</option>
                    <option value="credit_card">Cartão de Crédito</option>
                    <option value="cash">Dinheiro</option>
                    <option value="investment">Investimento</option>
                  </select>
                </div>
                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Status</label>
                  <select
                    className={styles.filterSelect}
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="">Todos os status</option>
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                    <option value="archived">Arquivado</option>
                  </select>
                </div>
                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Saldo Mínimo</label>
                  <input
                    type="number"
                    className={styles.filterInput}
                    placeholder="0,00"
                    value={filters.minBalance}
                    onChange={(e) => setFilters(prev => ({ ...prev, minBalance: e.target.value }))}
                  />
                </div>
                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Saldo Máximo</label>
                  <input
                    type="number"
                    className={styles.filterInput}
                    placeholder="Sem limite"
                    value={filters.maxBalance}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxBalance: e.target.value }))}
                  />
                </div>
              </div>
              <div className={styles.filtersActions}>
                <button
                  className={styles.applyFiltersButton}
                  onClick={applyFilters}
                >
                  Aplicar Filtros
                </button>
                <button
                  className={styles.clearFiltersButton}
                  onClick={clearFilters}
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Estados de carregamento e erro */}
        {isLoading && (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Carregando contas...</p>
          </div>
        )}

        {error && (
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>{error}</p>
            <button
              className={styles.retryButton}
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Grid de contas */}
        {!isLoading && !error && (
          <div className={styles.accountsGrid}>
            {(filteredAccounts.length > 0 ? filteredAccounts : accounts).length === 0 ? (
              <div className={styles.emptyState}>
                <p>Nenhuma conta encontrada.</p>
                <button
                  className={styles.addFirstAccountButton}
                  onClick={() => setShowAddAccountModal(true)}
                >
                  <Plus size={16} />
                  Adicionar primeira conta
                </button>
              </div>
            ) : (
              (filteredAccounts.length > 0 ? filteredAccounts : accounts).map((account) => {
                // Usar dados reais do histórico ou fallback para mockados
                const historyData = balanceHistory[account.id] || [];
                const graphData = historyData.length > 0
                  ? historyData.map(item => ({
                    date: item.date,
                    value: item.balance / 1000 // Normalizar para exibição
                  }))
                  : [
                    { date: "01", value: account.balance / 1000 * 0.8 },
                    { date: "05", value: account.balance / 1000 * 0.9 },
                    { date: "10", value: account.balance / 1000 * 0.85 },
                    { date: "15", value: account.balance / 1000 * 0.95 },
                    { date: "20", value: account.balance / 1000 * 0.9 },
                    { date: "25", value: account.balance / 1000 },
                    { date: "30", value: account.balance / 1000 * 0.95 }
                  ];
                const maxValue = getMaxValue(graphData);

                return (
                  <div key={account.id} className={styles.accountCard}>
                    {/* Header do card */}
                    <div className={styles.cardHeader}>
                      <div className={styles.bankInfo}>
                        <div className={styles.bankLogo}>
                          <Icon name={account.icon || "bank-bb"} size={32} />
                        </div>
                        <div className={styles.bankDetails}>
                          <h3 className={styles.bankName}>{account.name}</h3>
                          <p className={styles.accountType}>({account.type.name})</p>
                        </div>
                      </div>
                    </div>

                    {/* Saldo */}
                    <div className={styles.balanceSection}>
                      <div className={styles.balanceValue}>
                        R$ {account.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>

                    {/* Ações */}
                    <div className={styles.actionsSection}>
                      <button
                        className={styles.actionLink}
                        onClick={() => handleViewAccount(account)}
                      >
                        <Eye size={14} className={styles.actionIcon} />
                        Ver Detalhes
                      </button>
                      <button
                        className={styles.actionButton}
                        onClick={() => handleAccountAction(account, 'conciliar')}
                      >
                        Conciliar
                      </button>
                    </div>

                    {/* Gráfico */}
                    <div className={styles.graphSection}>
                      <div className={styles.graphContainer}>
                        <div className={styles.graph}>
                          <svg className={styles.graphLine} viewBox="0 0 200 80" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id={`areaGradient-${account.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                              </linearGradient>
                            </defs>

                            {/* Área preenchida */}
                            <path
                              className={styles.graphArea}
                              d={generateAreaPath(graphData, maxValue)}
                              fill={`url(#areaGradient-${account.id})`}
                            />

                            {/* Linha do gráfico */}
                            <path
                              className={styles.graphPath}
                              d={generateLinePath(graphData, maxValue)}
                              fill="none"
                            />
                          </svg>

                          {/* Pontos do gráfico */}
                          <div className={styles.graphPoints}>
                            {graphData.map((point, index) => {
                              const x = (index / (graphData.length - 1)) * 100;
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
                          {graphData.map((point, index) => (
                            <span key={index} className={styles.graphLabel}>
                              {point.date}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Modal de detalhes da conta */}
      {selectedAccount && (
        <AccountDetailsModal
          isOpen={showAccountDetailsModal}
          onClose={handleCloseAccountModal}
          account={{
            id: selectedAccount.id,
            userId: selectedAccount.userId,
            name: selectedAccount.name,
            type: {
              id: selectedAccount.type.id,
              name: selectedAccount.type.name,
              category: selectedAccount.type.category as any
            },
            balance: selectedAccount.balance,
            currency: selectedAccount.currency || "BRL",
            bankName: selectedAccount.bankName,
            accountNumber: selectedAccount.accountNumber,
            isActive: selectedAccount.isActive,
            createdAt: new Date(selectedAccount.createdAt),
            updatedAt: new Date(selectedAccount.updatedAt)
          }}
          accountType={{
            id: selectedAccount.type.id,
            name: selectedAccount.type.name,
            category: selectedAccount.type.category as any,
            description: selectedAccount.type.description || "Conta bancária",
            icon: selectedAccount.type.icon || selectedAccount.icon || "bank-bb"
          }}
          recentTransactions={recentTransactions[selectedAccount.id]?.map(transaction => ({
            id: transaction.id,
            userId: selectedAccount.userId,
            accountId: selectedAccount.id,
            description: transaction.description,
            amount: transaction.amount,
            type: transaction.type === 'income' ? TransactionType.INCOME : TransactionType.EXPENSE,
            status: transaction.status === 'completed' ? TransactionStatus.COMPLETED : TransactionStatus.PENDING,
            date: new Date(transaction.date),
            isRecurring: transaction.isRecurring || false,
            createdAt: new Date(transaction.createdAt || transaction.date),
            updatedAt: new Date(transaction.updatedAt || transaction.date)
          })) || []}
          balanceHistory={balanceHistory[selectedAccount.id]?.map(item => ({
            date: new Date(item.date),
            balance: item.balance
          })) || [
              { date: new Date(), balance: selectedAccount.balance * 0.8 },
              { date: new Date(), balance: selectedAccount.balance * 0.9 },
              { date: new Date(), balance: selectedAccount.balance }
            ]}
          onEdit={handleEditAccount}
          onDelete={handleDeleteAccount}
          onExport={handleExportAccount}
          onShare={handleShareAccount}
        />
      )}

      {/* Modal Adicionar Conta */}
      <AddAccountModal
        isOpen={showAddAccountModal}
        onClose={() => setShowAddAccountModal(false)}
        onSubmit={handleAddAccount}
      />
    </DashboardLayout>
  );
}