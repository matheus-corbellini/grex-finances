"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { ChevronLeft, ChevronRight, Plus, TrendingUp, TrendingDown, Eye } from "lucide-react";
import { BankIconComponent } from "../../../components/ui/BankIcons";
import { AccountDetailsModal, AddAccountModal, EditAccountModal, AccountActionModal } from "../../../components/modals";
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
  const [showEditAccountModal, setShowEditAccountModal] = useState(false);
  const [showAccountActionModal, setShowAccountActionModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<ApiAccount | null>(null);
  const [editingAccount, setEditingAccount] = useState<ApiAccount | null>(null);
  const [currentAction, setCurrentAction] = useState<string>('');
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
        [accountId]: history.history || []
      }));
    } catch (err: any) {
      console.error("Erro ao carregar histórico de saldos:", err);
      // Em caso de erro, não usar dados mockados - deixar vazio
      setBalanceHistory(prev => ({
        ...prev,
        [accountId]: []
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
        [accountId]: transactions.transactions || []
      }));
    } catch (err: any) {
      console.error("Erro ao carregar transações:", err);
      // Em caso de erro, não usar dados mockados - deixar vazio
      setRecentTransactions(prev => ({
        ...prev,
        [accountId]: []
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
    if (!graphData || graphData.length === 0) return 1;
    const values = graphData.map(d => d.value).filter(v => !isNaN(v) && isFinite(v));
    if (values.length === 0) return 1;
    return Math.max(...values);
  };

  const generateLinePath = (data: any[], maxValue: number) => {
    if (!data || data.length === 0 || maxValue <= 0) {
      return 'M 0,80 L 200,80';
    }

    const points = data.map((point, index) => {
      const x = (index / (data.length - 1)) * 200;
      const y = 80 - (point.value / maxValue) * 80;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  const generateAreaPath = (data: any[], maxValue: number) => {
    if (!data || data.length === 0 || maxValue <= 0) {
      return 'M 0,80 L 200,80 L 0,80 Z';
    }

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

  const handleEditAccount = () => {
    if (selectedAccount) {
      setEditingAccount(selectedAccount);
      setShowEditAccountModal(true);
      setShowAccountDetailsModal(false);
    }
  };

  const handleUpdateAccount = async (accountData: any) => {
    try {
      const updatedAccount = await accountsService.updateAccount(accountData.id, accountData);

      // Atualizar a lista de contas
      setAccounts(prev => prev.map(acc => acc.id === updatedAccount.id ? updatedAccount : acc));

      // Mostrar mensagem de sucesso
      alert("Conta atualizada com sucesso!");

    } catch (error: any) {
      console.error("Erro ao atualizar conta:", error);
      throw new Error(error.message || "Erro ao atualizar conta");
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

  const handleAccountAction = (account: ApiAccount, action: string) => {
    setSelectedAccount(account);
    setCurrentAction(action);
    setShowAccountActionModal(true);
  };

  const handleActionSubmit = async (action: string, data: any) => {
    try {
      switch (action) {
        case 'conciliar':
          await handleConciliation(data);
          break;
        case 'regularizar':
          await handleRegularization(data);
          break;
        case 'revisar':
          await handleReview(data);
          break;
        case 'ajustar':
          await handleAdjustment(data);
          break;
        case 'analisar':
          await handleAnalysis(data);
          break;
        case 'fechar':
          await handleAccountClosure(data);
          break;
        default:
          throw new Error('Ação não reconhecida');
      }

      alert(`${action.charAt(0).toUpperCase() + action.slice(1)} executada com sucesso!`);
    } catch (error: any) {
      console.error(`Erro ao executar ação ${action}:`, error);
      throw new Error(error.message || `Erro ao executar ação ${action}`);
    }
  };

  const handleConciliation = async (data: any) => {
    // Implementar lógica de conciliação
    console.log('Conciliando conta:', selectedAccount?.id, data);
    // Aqui você pode chamar uma API específica para conciliação
  };

  const handleRegularization = async (data: any) => {
    // Implementar lógica de regularização
    console.log('Regularizando conta:', selectedAccount?.id, data);
    // Aqui você pode chamar uma API específica para regularização
  };

  const handleReview = async (data: any) => {
    // Implementar lógica de revisão
    console.log('Revisando conta:', selectedAccount?.id, data);
    // Aqui você pode chamar uma API específica para revisão
  };

  const handleAdjustment = async (data: any) => {
    // Implementar lógica de ajuste
    console.log('Ajustando conta:', selectedAccount?.id, data);
    // Aqui você pode chamar uma API específica para ajuste
  };

  const handleAnalysis = async (data: any) => {
    // Implementar lógica de análise
    console.log('Analisando conta:', selectedAccount?.id, data);
    // Aqui você pode chamar uma API específica para análise
  };

  const handleAccountClosure = async (data: any) => {
    // Implementar lógica de fechamento
    console.log('Fechando conta:', selectedAccount?.id, data);
    // Aqui você pode chamar uma API específica para fechamento
  };

  const handleSyncAccount = async (account: ApiAccount) => {
    try {
      // Mostrar loading
      const originalAccounts = [...accounts];
      setAccounts(prev => prev.map(acc =>
        acc.id === account.id ? { ...acc, isSyncing: true } : acc
      ));

      // Chamar API de sincronização
      const syncedAccount = await accountsService.syncAccount(account.id);

      // Atualizar conta com dados sincronizados
      setAccounts(prev => prev.map(acc =>
        acc.id === account.id ? { ...syncedAccount, isSyncing: false } : acc
      ));

      // Recarregar histórico e transações
      await Promise.all([
        loadBalanceHistory(account.id),
        loadRecentTransactions(account.id)
      ]);

      alert("Conta sincronizada com sucesso!");
    } catch (error: any) {
      console.error("Erro ao sincronizar conta:", error);

      // Reverter estado de loading
      setAccounts(prev => prev.map(acc =>
        acc.id === account.id ? { ...acc, isSyncing: false } : acc
      ));

      alert("Erro ao sincronizar conta: " + error.message);
    }
  };

  const handleAddAccount = async (accountData: any) => {
    try {
      console.log('Dados recebidos do modal:', accountData);

      // Converter os dados para o formato esperado pela API
      const apiData: CreateAccountDto = {
        name: accountData.name,
        type: accountData.type, // Usar o tipo diretamente como esperado pelo backend
        bankName: accountData.bankName || undefined,
        accountNumber: accountData.accountNumber || undefined,
        agency: accountData.agency || undefined,
        initialBalance: accountData.initialBalance,
        description: accountData.description || undefined,
        currency: 'BRL'
      };

      console.log('Dados sendo enviados para a API:', apiData);

      // Chamar API para criar conta
      const newAccount = await accountsService.createAccount(apiData);

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
                // Usar dados reais do histórico
                const historyData = balanceHistory[account.id] || [];
                const graphData = historyData.length > 0
                  ? historyData.map(item => ({
                    date: item.date,
                    value: item.balance / 1000 // Normalizar para exibição
                  }))
                  : [
                    // Se não há dados históricos, mostrar apenas o saldo atual
                    { date: "Atual", value: account.balance / 1000 }
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
                        onClick={() => handleSyncAccount(account)}
                        disabled={account.isSyncing}
                      >
                        {account.isSyncing ? 'Sincronizando...' : 'Sincronizar'}
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
                              const x = graphData.length > 1 ? (index / (graphData.length - 1)) * 100 : 50;
                              const y = maxValue > 0 ? 100 - (point.value / maxValue) * 100 : 50;

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

      {/* Modal Editar Conta */}
      <EditAccountModal
        isOpen={showEditAccountModal}
        onClose={() => {
          setShowEditAccountModal(false);
          setEditingAccount(null);
        }}
        onSubmit={handleUpdateAccount}
        account={editingAccount}
      />

      {/* Modal Ações da Conta */}
      <AccountActionModal
        isOpen={showAccountActionModal}
        onClose={() => {
          setShowAccountActionModal(false);
          setCurrentAction('');
        }}
        onSubmit={handleActionSubmit}
        account={selectedAccount as any}
        action={currentAction}
      />
    </DashboardLayout>
  );
}