"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { ChevronLeft, ChevronRight, Plus, TrendingUp, TrendingDown, Eye } from "lucide-react";
import { BankIconComponent } from "../../../components/ui/BankIcons";
import { AccountDetailsModal, AddAccountModal, EditAccountModal, AccountActionModal } from "../../../components/modals";
import { Icon } from "../../../components/ui/Icon";
import { BankAccountCard } from "../../../components/ui/BankAccountCard";
import { TransactionType, TransactionStatus } from "../../../../shared/types/transaction.types";
import accountsService, { CreateAccountDto } from "../../../services/api/accounts.service";
import { Account } from "../../../../shared/types/account.types";
import styles from "./Accounts.module.css";
import { safeErrorLog } from "../../../utils/error-logger";

export default function Accounts() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 6, 1)); // Julho 2024
  const [showAccountDetailsModal, setShowAccountDetailsModal] = useState(false);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [showEditAccountModal, setShowEditAccountModal] = useState(false);
  const [showAccountActionModal, setShowAccountActionModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [currentAction, setCurrentAction] = useState<string>('');
  const [accounts, setAccounts] = useState<Account[]>([]);
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
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
  const [syncingAccounts, setSyncingAccounts] = useState<Set<string>>(new Set());

  // Carregar histórico de saldos para uma conta
  const loadBalanceHistory = async (accountId: string, isMounted: boolean = true) => {
    try {
      const history = await accountsService.getBalanceHistory(accountId, {
        startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString(),
        endDate: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString(),
        period: viewMode === 'week' ? 'daily' : 'daily'
      });

      if (isMounted) {
        setBalanceHistory(prev => ({
          ...prev,
          [accountId]: history.history || []
        }));
      }
    } catch (err: any) {
      console.error("Erro ao carregar histórico de saldos:", err);
      // Em caso de erro, não usar dados mockados - deixar vazio
      if (isMounted) {
        setBalanceHistory(prev => ({
          ...prev,
          [accountId]: []
        }));
      }
    }
  };

  // Carregar transações recentes para uma conta
  const loadRecentTransactions = async (accountId: string, isMounted: boolean = true) => {
    try {
      const transactions = await accountsService.getAccountTransactions(accountId, {
        page: 1,
        limit: 5,
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Últimos 30 dias
        endDate: new Date().toISOString()
      });

      if (isMounted) {
        setRecentTransactions(prev => ({
          ...prev,
          [accountId]: transactions.transactions || []
        }));
      }
    } catch (err: any) {
      console.error("Erro ao carregar transações:", err);
      // Em caso de erro, não usar dados mockados - deixar vazio
      if (isMounted) {
        setRecentTransactions(prev => ({
          ...prev,
          [accountId]: []
        }));
      }
    }
  };

  // Carregar contas da API
  useEffect(() => {
    let isMounted = true;

    const loadAccounts = async () => {
      try {
        if (isMounted) {
          setIsLoading(true);
          setError(null);
        }

        const accountsData = await accountsService.getAccounts();

        if (isMounted) {
          setAccounts(accountsData);

          // Carregar histórico de saldos e transações para cada conta
          for (const account of accountsData) {
            await Promise.all([
              loadBalanceHistory(account.id, isMounted),
              loadRecentTransactions(account.id, isMounted)
            ]);
          }
        }
      } catch (err: any) {
        console.error("Erro ao carregar contas:", err);
        if (isMounted) {
          setError(err.message || "Erro ao carregar contas");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadAccounts();

    return () => {
      isMounted = false;
    };
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
      filtered = filtered.filter(account => account.type?.category === filters.type);
    }

    if (filters.status) {
      if (filters.status === 'active') {
        filtered = filtered.filter(account => account.isActive);
      } else if (filters.status === 'inactive') {
        filtered = filtered.filter(account => !account.isActive);
      } else if (filters.status === 'archived') {
        filtered = filtered.filter(account => !account.isActive);
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

    const values = graphData
      .map(d => {
        const value = parseFloat(d.value?.toString() || '0');
        return isFinite(value) && !isNaN(value) ? value : 0;
      })
      .filter(v => v > 0);

    if (values.length === 0) return 1;

    const maxValue = Math.max(...values);
    return isFinite(maxValue) && !isNaN(maxValue) ? maxValue : 1;
  };

  const generateLinePath = (data: any[], maxValue: number) => {
    if (!data || data.length === 0 || maxValue <= 0 || !isFinite(maxValue)) {
      return 'M 0,100 L 300,100';
    }

    const points = data.map((point, index) => {
      const x = (index / (data.length - 1)) * 300;
      const value = parseFloat(point.value?.toString() || '0');

      // Validar se o valor é um número válido
      if (!isFinite(value) || isNaN(value)) {
        return '0,100';
      }

      const y = 100 - (value / maxValue) * 100;

      // Validar se y é um número válido
      if (!isFinite(y) || isNaN(y)) {
        return '0,100';
      }

      return `${x},${y}`;
    });

    // Filtrar pontos válidos e garantir que temos pelo menos 2 pontos
    const validPoints = points.filter(point => {
      const [x, y] = point.split(',').map(Number);
      return isFinite(x) && isFinite(y) && !isNaN(x) && !isNaN(y);
    });

    if (validPoints.length < 2) {
      return 'M 0,100 L 300,100';
    }

    // Criar curvas suaves usando Bézier
    let path = `M ${validPoints[0]}`;
    for (let i = 1; i < validPoints.length; i++) {
      const [prevX, prevY] = validPoints[i - 1].split(',').map(Number);
      const [currX, currY] = validPoints[i].split(',').map(Number);

      const controlPoint1X = prevX + (currX - prevX) / 3;
      const controlPoint2X = prevX + 2 * (currX - prevX) / 3;

      path += ` C ${controlPoint1X},${prevY} ${controlPoint2X},${currY} ${currX},${currY}`;
    }

    return path;
  };

  const generateAreaPath = (data: any[], maxValue: number) => {
    if (!data || data.length === 0 || maxValue <= 0 || !isFinite(maxValue)) {
      return 'M 0,100 L 300,100 L 0,100 Z';
    }

    const linePath = generateLinePath(data, maxValue);

    // Se a linha não é válida, retornar área padrão
    if (!linePath || linePath === 'M 0,100 L 300,100') {
      return 'M 0,100 L 300,100 L 0,100 Z';
    }

    const firstX = 0;
    const lastX = 300;
    const bottomY = 100;

    return `${linePath} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;
  };

  const handleViewAccount = (account: Account) => {
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

      // Verificar se o elemento ainda existe antes de removê-lo
      if (link.parentNode) {
        document.body.removeChild(link);
      }

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

  const handleAccountAction = (account: Account, action: string) => {
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

  const handleSyncAccount = async (account: Account) => {
    try {
      // Mostrar loading
      setSyncingAccounts(prev => new Set(prev).add(account.id));

      // Chamar API de sincronização
      const syncedAccount = await accountsService.syncAccount(account.id);

      // Atualizar conta com dados sincronizados
      setAccounts(prev => prev.map(acc =>
        acc.id === account.id ? syncedAccount : acc
      ));

      // Recarregar histórico e transações
      await Promise.all([
        loadBalanceHistory(account.id),
        loadRecentTransactions(account.id)
      ]);

      // Remover loading
      setSyncingAccounts(prev => {
        const newSet = new Set(prev);
        newSet.delete(account.id);
        return newSet;
      });

      alert("Conta sincronizada com sucesso!");
    } catch (error: any) {
      console.error("Erro ao sincronizar conta:", error);

      // Remover loading em caso de erro
      setSyncingAccounts(prev => {
        const newSet = new Set(prev);
        newSet.delete(account.id);
        return newSet;
      });

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
      safeErrorLog("Erro detalhado ao criar conta:", error);
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
                const historyData = balanceHistory[account.id] || [];

                // Dados mockados temporários para teste
                const mockData = [
                  { date: "09 jan", value: 13000 },
                  { date: "10 jan", value: 15500 },
                  { date: "11 jan", value: 12000 },
                  { date: "12 jan", value: 17000 },
                  { date: "13 jan", value: 11500 },
                  { date: "14 jan", value: 13000 },
                  { date: "15 jan", value: 11000 },
                ];

                const chartData = historyData.length > 1
                  ? historyData.map(item => {
                    const balance = parseFloat(item.balance?.toString() || '0');
                    return {
                      date: new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
                      value: isFinite(balance) ? balance : 0
                    };
                  })
                  : mockData;

                // Filtrar dados válidos
                const validChartData = chartData.filter(d => isFinite(d.value) && !isNaN(d.value));

                // Calcular domínio do eixo Y apenas se houver dados válidos
                let yAxisDomain: [number, number] = [0, 1000];
                let yAxisTicks: number[] = [0, 200, 400, 600, 800, 1000];

                if (validChartData.length > 0) {
                  const values = validChartData.map(d => d.value);
                  const minValue = Math.min(...values);
                  const maxValue = Math.max(...values);

                  // Evitar divisão por zero
                  if (maxValue !== minValue) {
                    const padding = (maxValue - minValue) * 0.1;
                    yAxisDomain = [minValue - padding, maxValue + padding];

                    // Gerar ticks do eixo Y
                    const step = (maxValue - minValue) / 5;
                    yAxisTicks = [];
                    for (let i = 0; i <= 5; i++) {
                      const tick = minValue + (step * i);
                      if (isFinite(tick)) {
                        yAxisTicks.push(tick);
                      }
                    }
                  } else {
                    // Se todos os valores são iguais, criar um domínio simétrico
                    yAxisDomain = [minValue * 0.9, minValue * 1.1];
                    yAxisTicks = [minValue * 0.9, minValue, minValue * 1.1];
                  }
                }

                return (
                  <BankAccountCard
                    key={account.id}
                    bankName={account.name}
                    accountType={account.type?.name || `Tipo ${account.type}`}
                    balance={account.balance}
                    logo={account.icon || "bank-bb"}
                    actionLabel="Ver extrato"
                    highlighted={false}
                    chartData={validChartData.length > 0 ? validChartData : mockData}
                    yAxisDomain={yAxisDomain}
                    yAxisTicks={yAxisTicks}
                    onViewDetails={() => handleViewAccount(account)}
                  />
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
            type: selectedAccount.type ? {
              id: selectedAccount.type.id || '',
              name: selectedAccount.type.name || 'Tipo não definido',
              category: selectedAccount.type.category as any
            } : {
              id: '',
              name: 'Tipo não definido',
              category: 'checking'
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
            id: selectedAccount.type?.id || '',
            name: selectedAccount.type?.name || 'Tipo não definido',
            category: selectedAccount.type?.category as any || 'checking',
            description: selectedAccount.type?.description || "Conta bancária",
            icon: selectedAccount.type?.icon || selectedAccount.icon || "bank-bb"
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