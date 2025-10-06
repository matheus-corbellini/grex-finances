"use client";

import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { DropdownPortal } from "../../../components/ui/DropdownPortal";
import styles from "./Transactions.module.css";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Upload,
  Download,
  Printer,
  Search,
  ArrowUpDown,
  CheckCircle,
  Circle,
  Eye,
  Plus
} from "lucide-react";
import { Toast } from "../../../components/ui/Toast";
import { TransactionViewModal, EditTransactionModal, ImportTransactionsModal } from "../../../components/modals";
import AddTransactionModal from "../../../components/modals/AddTransactionModal";
import transactionsService from "../../../services/api/transactions.service";
import accountsService from "../../../services/api/accounts.service";
// PDF functionality moved inline to avoid build issues
import { Transaction, TransactionType, TransactionStatus } from "../../../../shared/types/transaction.types";
import { Account } from "../../../../shared/types/account.types";
import { Category } from "../../../../shared/types/category.types";
import { safeErrorLog } from "../../../utils/error-logger";
import { useAuthRedirect } from "../../../hooks/useAuthRedirect";

export default function Transactions() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8, 1)); // Setembro 2025
  const [activeView, setActiveView] = useState("Mês");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState<string>("3"); // Terceira linha selecionada como no modelo
  const [selectedRows, setSelectedRows] = useState<string[]>([]); // Linhas selecionadas
  const [selectAll, setSelectAll] = useState(false); // Selecionar todos
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [statusDropdowns, setStatusDropdowns] = useState<{ [key: string]: boolean }>({});
  const [statusButtonRefs, setStatusButtonRefs] = useState<{ [key: string]: React.RefObject<HTMLButtonElement> }>({});

  // Usar o hook de redirecionamento de autenticação
  useAuthRedirect();

  // Criar refs para os botões de status individuais
  const getStatusButtonRef = (transactionId: string) => {
    if (!statusButtonRefs[transactionId]) {
      statusButtonRefs[transactionId] = React.createRef<HTMLButtonElement>();
    }
    return statusButtonRefs[transactionId];
  };
  const [showTransactionViewModal, setShowTransactionViewModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);
  const [showEditTransactionModal, setShowEditTransactionModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Estados para ordenação
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Estados para resumo dinâmico
  const [balanceSummary, setBalanceSummary] = useState({
    dailyBalance: 0,
    expectedBalance: 0,
    actualBalance: 0
  });

  // Estados para dados dinâmicos
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);

  // Estados para filtros
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    type: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  });
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);

  // Carregar transações da API
  useEffect(() => {
    loadTransactions();
    loadCategories();
    loadAccounts();
  }, [currentPage, searchTerm, activeView, currentDate]);


  // Aplicar filtros quando mudarem
  useEffect(() => {
    applyFilters();
  }, [transactions, filters]);

  // Calcular resumo de saldos quando transações mudarem
  useEffect(() => {
    calculateBalanceSummary();
  }, [filteredTransactions]);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const filter = {
        search: searchTerm || undefined,
        // Adicionar filtros de data baseados na view ativa
        ...(activeView === "Mês" && {
          startDate: new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1), // Últimos 3 meses
          endDate: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
        }),
        ...(activeView === "Semana" && {
          startDate: new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000),
          endDate: currentDate
        })
      };

      const response = await transactionsService.getTransactions(filter, {
        page: currentPage,
        limit: 10
      });

      setTransactions(response.data || []);
      setTotalTransactions(response.pagination?.total || 0);
    } catch (err: any) {
      console.error("Erro ao carregar transações:", err);

      // Se for erro de autenticação, não mostrar erro na UI
      // O evento auth:unauthorized já foi disparado
      if (err.code === 'UNKNOWN_ERROR' && err.message?.includes('401')) {
        console.log("🔐 Erro 401 detectado - evento de autenticação já foi disparado");
        return;
      }

      // Para outros erros, mostrar na UI
      setError(err.message || "Erro ao carregar transações");
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const categoriesData = await transactionsService.getCategories();
      setCategories(categoriesData || []);
    } catch (err) {
      console.error("❌ Erro ao carregar categorias:", err);
      setCategories([]);
    }
  };

  const loadAccounts = async () => {
    try {
      const accountsData = await accountsService.getAccounts();
      setAccounts(accountsData || []);
    } catch (err) {
      console.error("❌ Erro ao carregar contas:", err);
      setAccounts([]);
    }
  };

  // Função para aplicar filtros
  const applyFilters = () => {
    let filtered = [...(transactions || [])];

    // Filtro por busca (descrição)
    if (filters.search) {
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Filtro por categoria
    if (filters.category) {
      filtered = filtered.filter(transaction =>
        transaction.categoryId === filters.category
      );
    }

    // Filtro por tipo
    if (filters.type) {
      filtered = filtered.filter(transaction =>
        transaction.type === filters.type
      );
    }

    // Filtro por status
    if (filters.status) {
      filtered = filtered.filter(transaction =>
        transaction.status === filters.status
      );
    }

    // Filtro por data
    if (filters.dateFrom) {
      filtered = filtered.filter(transaction =>
        new Date(transaction.date) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(transaction =>
        new Date(transaction.date) <= new Date(filters.dateTo)
      );
    }

    setFilteredTransactions(filtered);
  };

  // Funções para atualizar filtros
  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      type: '',
      status: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  // Função para calcular resumo de saldos dinâmico
  const calculateBalanceSummary = () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    let dailyBalance = 0;
    let expectedBalance = 0;
    let actualBalance = 0;

    (filteredTransactions || []).forEach(transaction => {
      // Validate date before processing
      const date = new Date(transaction.date);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date for transaction:', transaction.id, transaction.date);
        return; // Skip this transaction
      }

      const transactionDate = date.toISOString().split('T')[0];
      const amount = Number(transaction.amount);

      // Saldo do dia (transações de hoje)
      if (transactionDate === todayStr) {
        dailyBalance += amount;
      }

      // Saldo previsto (todas as transações pendentes e concluídas)
      if (transaction.status === 'pending' || transaction.status === 'completed') {
        expectedBalance += amount;
      }

      // Saldo realizado (apenas transações concluídas)
      if (transaction.status === 'completed') {
        actualBalance += amount;
      }
    });

    setBalanceSummary({
      dailyBalance,
      expectedBalance,
      actualBalance
    });
  };

  // Função para ordenar transações
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Aplicar ordenação às transações filtradas
  const getSortedTransactions = () => {
    if (!sortField) return filteredTransactions || [];

    return [...(filteredTransactions || [])].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'description':
          aValue = a.description.toLowerCase();
          bValue = b.description.toLowerCase();
          break;
        case 'category':
          aValue = a.categoryId?.toLowerCase() || '';
          bValue = b.categoryId?.toLowerCase() || '';
          break;
        case 'amount':
          aValue = Math.abs(a.amount);
          bValue = Math.abs(b.amount);
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'date':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const handleAddTransaction = async (transactionData: any) => {
    try {
      console.log('Dados recebidos do modal:', transactionData);
      console.log('Data recebida:', transactionData.date);
      console.log('Tipo da data:', typeof transactionData.date);

      // Converter os dados para o formato esperado pela API
      const apiData = {
        ...transactionData,
        date: new Date(transactionData.date), // Converter string para Date
        // Os tipos TransactionType e TransactionStatus já estão corretos
      };

      console.log('Dados sendo enviados para a API:', apiData);
      console.log('Data convertida:', apiData.date);
      console.log('Data é válida?', !isNaN(apiData.date.getTime()));
      console.log('CategoryId:', apiData.categoryId);
      console.log('AccountId:', apiData.accountId);

      const response = await transactionsService.createTransaction(apiData);

      console.log('Resposta da API:', response);
      console.log('Tipo da resposta:', typeof response);
      console.log('Propriedades da resposta:', Object.keys(response || {}));

      // Extrair apenas o objeto transaction da resposta
      const newTransaction = response;
      console.log('Transação extraída:', newTransaction);

      // Atualizar a lista de transações
      setTransactions(prev => [newTransaction, ...prev]);
      setTotalTransactions(prev => prev + 1);

      // Mostrar mensagem de sucesso
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);

    } catch (error: any) {
      safeErrorLog("Erro ao adicionar transação:", error);
      throw new Error(error.message || "Erro ao adicionar transação");
    }
  };

  // Funções auxiliares para formatação
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'completed': 'Concluída',
      'pending': 'Pendente',
      'cancelled': 'Cancelada',
      'failed': 'Falhada'
    };
    return labels[status] || status;
  };

  const getStatusTypeClass = (status: string) => {
    const classes: Record<string, string> = {
      'completed': styles.success,
      'pending': styles.warning,
      'cancelled': styles.error,
      'failed': styles.error
    };
    return classes[status] || styles.warning;
  };

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionViewModal(true);
  };

  const handleCloseTransactionModal = () => {
    setShowTransactionViewModal(false);
    setSelectedTransaction(null);
  };

  // Atualizar contagem de transações no cabeçalho
  const updateTransactionsTitle = () => {
    const count = filteredTransactions.length;
    return `${count} Lançamento${count !== 1 ? 's' : ''}`;
  };

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Não fechar se clicou em dropdown ou elementos relacionados
      if (target.closest('[data-dropdown]') ||
        target.closest('.dropdown') ||
        target.closest('.dropdownItem') ||
        target.closest('.statusDropdown') ||
        target.closest('.statusDropdownContainer') ||
        target.closest('.statusDropdownButton')) {
        return;
      }

      setOpenDropdowns({});
      setStatusDropdowns({});
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Opções de categoria
  const categoryOptions = [
    'Alimentação',
    'Transporte',
    'Saúde',
    'Educação',
    'Lazer',
    'Casa',
    'Roupas',
    'Tecnologia',
    'Outros'
  ];

  // Opções de status
  const statusOptions = [
    { value: 'Pendente', label: 'Pendente', type: 'warning' },
    { value: 'Pago', label: 'Pago', type: 'success' },
    { value: 'Vencido', label: 'Vencido', type: 'error' },
    { value: 'Cancelado', label: 'Cancelado', type: 'neutral' }
  ];

  const toggleDropdown = (dropdownId: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [dropdownId]: !prev[dropdownId]
    }));
  };

  // Função para fechar todos os dropdowns
  const closeAllDropdowns = () => {
    setStatusDropdowns({});
    setOpenDropdowns({});
  };

  // Função para alternar dropdown de status individual
  const toggleStatusDropdown = (transactionId: string) => {
    const isCurrentlyOpen = statusDropdowns[transactionId];

    // Fechar todos os outros dropdowns primeiro
    setOpenDropdowns({});

    // Se o dropdown atual estava fechado, abrir apenas ele
    if (!isCurrentlyOpen) {
      setStatusDropdowns({ [transactionId]: true });
    } else {
      // Se estava aberto, fechar todos
      setStatusDropdowns({});
    }
  };

  const updateTransaction = (transactionId: string, field: 'category' | 'status', value: string) => {

    setTransactions(prevTransactions =>
      prevTransactions.map(transaction => {
        if (transaction.id === transactionId) {
          if (field === 'status') {
            // Encontrar o tipo de status baseado no valor
            const statusOption = statusOptions.find(option => option.value === value);
            return {
              ...transaction,
              status: value as TransactionStatus,
              statusType: statusOption?.type || 'neutral'
            };
          } else {
            return {
              ...transaction,
              [field]: value
            };
          }
        }
        return transaction;
      })
    );

    // Mostrar mensagem de sucesso para alterações individuais
    if (field === 'status') {
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 2000);
    }

    // Fechar o dropdown
    setOpenDropdowns(prev => ({
      ...prev,
      [`${field}-${transactionId}`]: false
    }));

    // Fechar dropdown de status se for alteração de status
    if (field === 'status') {
      setStatusDropdowns(prev => ({
        ...prev,
        [transactionId]: false
      }));
    }
  };

  // Funções de seleção
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows((filteredTransactions || []).map(t => t.id));
    }
    setSelectAll(!selectAll);
  };

  const isRowSelected = (transactionId: string) => {
    return selectedRows.includes(transactionId);
  };

  const toggleRowSelection = (id: string) => {
    setSelectedRows(prev => {
      if (prev.includes(id)) {
        return prev.filter(rowId => rowId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleRowClick = (transactionId: string, event: React.MouseEvent) => {
    // Não fazer nada ao clicar na linha - apenas o checkbox deve selecionar
    return;
  };

  const handleEditTransaction = () => {
    if (selectedTransaction) {
      setEditingTransaction(selectedTransaction);
      setShowEditTransactionModal(true);
      setShowTransactionViewModal(false);
    }
  };

  const handleUpdateTransaction = async (transactionData: any) => {
    try {
      const updatedTransaction = await transactionsService.updateTransaction(
        transactionData.id,
        transactionData
      );

      // Atualizar a lista de transações
      setTransactions(prev =>
        prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
      );

      // Mostrar mensagem de sucesso
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);

    } catch (error: any) {
      console.error("Erro ao atualizar transação:", error);
      throw new Error(error.message || "Erro ao atualizar transação");
    }
  };

  const handleDeleteTransaction = () => {
    if (selectedTransaction) {
      const confirmDelete = window.confirm(
        `Tem certeza que deseja excluir a transação "${selectedTransaction.description}"?\n\nEsta ação não pode ser desfeita.`
      );

      if (confirmDelete) {
        // Implementar exclusão via API
        transactionsService.deleteTransaction(selectedTransaction.id)
          .then(() => {
            // Recarregar transações
            loadTransactions();
            // Fechar modal
            setShowTransactionViewModal(false);
            setSelectedTransaction(null);
            // Mostrar mensagem de sucesso
            alert("Transação excluída com sucesso!");
          })
          .catch((error) => {
            console.error("Erro ao excluir transação:", error);
            alert("Erro ao excluir transação. Tente novamente.");
          });
      }
    }
  };

  const handleDuplicateTransaction = async () => {
    if (selectedTransaction) {
      try {
        // Usar a API para duplicar a transação
        const duplicatedTransaction = await transactionsService.duplicateTransaction(selectedTransaction.id);

        // Atualizar a lista de transações
        setTransactions(prev => [duplicatedTransaction, ...prev]);
        setTotalTransactions(prev => prev + 1);

        // Mostrar mensagem de sucesso
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);

        // Fechar modal de visualização
        setShowTransactionViewModal(false);
        setSelectedTransaction(null);

      } catch (error: any) {
        console.error("Erro ao duplicar transação:", error);
        alert("Erro ao duplicar transação: " + error.message);
      }
    }
  };

  const handleShareTransaction = () => {
    if (selectedTransaction) {
      // Criar texto para compartilhamento
      const shareText = `Transação: ${selectedTransaction.description}\n` +
        `Valor: R$ ${selectedTransaction.amount.toFixed(2)}\n` +
        `Data: ${new Date(selectedTransaction.date).toLocaleDateString('pt-BR')}\n` +
        `Categoria: ${selectedTransaction.categoryId || 'N/A'}\n` +
        `Status: ${selectedTransaction.status}`;

      // Copiar para área de transferência
      navigator.clipboard.writeText(shareText).then(() => {
        alert("Transação copiada para a área de transferência!");
      }).catch(() => {
        // Fallback para navegadores que não suportam clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = shareText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert("Transação copiada para a área de transferência!");
      });
    }
  };


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

  const exportToPDF = () => {
    if (selectedRows.length === 0) {
      alert("Selecione pelo menos uma transação para exportar");
      return;
    }

    const selectedTransactions = (filteredTransactions || []).filter(t => selectedRows.includes(t.id));

    // Importar jsPDF dinamicamente
    import('jspdf').then((jsPDF) => {
      const doc = new jsPDF.default();

      // Configurações do PDF
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const tableStartY = 80;
      const rowHeight = 10;
      const colWidths = [15, 75, 35, 35, 30]; // Larguras das colunas

      // Cores
      const primaryColor = [59, 130, 246]; // Azul #3b82f6
      const lightGray = [248, 250, 252]; // #f8fafc
      const darkGray = [55, 65, 81]; // #374151

      // Header com fundo colorido
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, pageWidth, 50, 'F');

      // Logo/Título principal
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('GREX FINANCES', margin, 20);

      // Subtítulo
      doc.setFontSize(16);
      doc.setFont('helvetica', 'normal');
      doc.text('Relatório de Lançamentos', margin, 30);

      // Data e período
      doc.setFontSize(12);
      doc.text(`Período: ${formatDate(currentDate)}`, margin, 40);

      // Informações do relatório
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`Total de lançamentos selecionados: ${selectedTransactions.length}`, margin, 60);
      doc.text(`Data de geração: ${new Date().toLocaleDateString('pt-BR')}`, margin, 70);

      // Cabeçalhos da tabela com fundo
      doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.rect(margin, tableStartY - 8, pageWidth - (margin * 2), 12, 'F');

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      const headers = ['Tipo', 'Descrição', 'Categoria', 'Valor', 'Status'];
      let currentX = margin + 5;

      headers.forEach((header, index) => {
        doc.text(header, currentX, tableStartY);
        currentX += colWidths[index];
      });

      // Linha separadora
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(0.5);
      doc.line(margin, tableStartY + 2, pageWidth - margin, tableStartY + 2);

      // Dados da tabela
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      let currentY = tableStartY + 15;

      selectedTransactions.forEach((transaction, index) => {
        // Verificar se precisa de nova página
        if (currentY > doc.internal.pageSize.getHeight() - 30) {
          doc.addPage();
          currentY = 30;
        }

        // Alternar cor de fundo das linhas
        if (index % 2 === 0) {
          doc.setFillColor(250, 250, 250);
          doc.rect(margin, currentY - 6, pageWidth - (margin * 2), rowHeight, 'F');
        }

        const rowData = [
          '', // Tipo (vazio)
          transaction.description,
          transaction.categoryId,
          transaction.amount,
          transaction.status
        ];

        currentX = margin + 5;
        rowData.forEach((data, colIndex) => {
          // Truncar texto se muito longo
          let text = String(data);
          if (colIndex === 1 && text.length > 30) {
            text = text.substring(0, 27) + '...';
          }

          // Cor especial para valores monetários
          if (colIndex === 3) {
            doc.setTextColor(34, 197, 94); // Verde para valores
            doc.setFont('helvetica', 'bold');
          } else {
            doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
            doc.setFont('helvetica', 'normal');
          }

          doc.text(text, currentX, currentY);
          currentX += colWidths[colIndex];
        });

        currentY += rowHeight;
      });

      // Rodapé
      const footerY = doc.internal.pageSize.getHeight() - 15;
      doc.setTextColor(156, 163, 175); // Cinza claro
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('Gerado automaticamente pelo sistema Grex Finances', margin, footerY);
      doc.text(`Página 1 de 1`, pageWidth - margin - 20, footerY);

      // Salvar o PDF
      doc.save(`lancamentos_${formatDate(currentDate).replace(' ', '_')}.pdf`);
    }).catch((error) => {
      console.error('Erro ao carregar jsPDF:', error);
      alert('Erro ao gerar PDF. Verifique se a biblioteca jsPDF está instalada.');
    });
  };

  const exportSelectedToPDF = () => {
    if (selectedRows.length === 0) {
      alert('Selecione pelo menos um item para exportar');
      return;
    }

    // Importar jsPDF dinamicamente
    import('jspdf').then((jsPDF) => {
      const doc = new jsPDF.default();

      // Configurações do PDF
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const tableStartY = 80;
      const rowHeight = 10;
      const colWidths = [15, 75, 35, 35, 30]; // Larguras das colunas

      // Cores
      const primaryColor = [59, 130, 246]; // Azul #3b82f6
      const lightGray = [248, 250, 252]; // #f8fafc
      const darkGray = [55, 65, 81]; // #374151

      // Header com fundo colorido
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, pageWidth, 50, 'F');

      // Logo/Título principal
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('GREX FINANCES', margin, 20);

      // Subtítulo
      doc.setFontSize(16);
      doc.setFont('helvetica', 'normal');
      doc.text('Relatório de Lançamentos Selecionados', margin, 30);

      // Data e período
      doc.setFontSize(12);
      doc.text(`Período: ${formatDate(currentDate)}`, margin, 40);

      // Informações do relatório
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`Lançamentos selecionados: ${selectedRows.length}`, margin, 60);
      doc.text(`Data de geração: ${new Date().toLocaleDateString('pt-BR')}`, margin, 70);

      // Cabeçalhos da tabela com fundo
      doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.rect(margin, tableStartY - 8, pageWidth - (margin * 2), 12, 'F');

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      const headers = ['Tipo', 'Descrição', 'Categoria', 'Valor', 'Status'];
      let currentX = margin + 5;

      headers.forEach((header, index) => {
        doc.text(header, currentX, tableStartY);
        currentX += colWidths[index];
      });

      // Linha separadora
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(0.5);
      doc.line(margin, tableStartY + 2, pageWidth - margin, tableStartY + 2);

      // Dados da tabela - apenas os selecionados
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      let currentY = tableStartY + 15;

      const selectedTransactions = (transactions || []).filter(transaction =>
        selectedRows.includes(transaction.id)
      );

      selectedTransactions.forEach((transaction, index) => {
        // Verificar se precisa de nova página
        if (currentY > doc.internal.pageSize.getHeight() - 30) {
          doc.addPage();
          currentY = 30;
        }

        // Alternar cor de fundo das linhas
        if (index % 2 === 0) {
          doc.setFillColor(250, 250, 250);
          doc.rect(margin, currentY - 6, pageWidth - (margin * 2), rowHeight, 'F');
        }

        const rowData = [
          '', // Tipo (vazio)
          transaction.description,
          transaction.categoryId,
          transaction.amount,
          transaction.status
        ];

        currentX = margin + 5;
        rowData.forEach((data, colIndex) => {
          // Truncar texto se muito longo
          let text = String(data);
          if (colIndex === 1 && text.length > 30) {
            text = text.substring(0, 27) + '...';
          }

          // Cor especial para valores monetários
          if (colIndex === 3) {
            doc.setTextColor(34, 197, 94); // Verde para valores
            doc.setFont('helvetica', 'bold');
          } else {
            doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
            doc.setFont('helvetica', 'normal');
          }

          doc.text(text, currentX, currentY);
          currentX += colWidths[colIndex];
        });

        currentY += rowHeight;
      });

      // Rodapé
      const footerY = doc.internal.pageSize.getHeight() - 15;
      doc.setTextColor(156, 163, 175); // Cinza claro
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('Gerado automaticamente pelo sistema Grex Finances', margin, footerY);
      doc.text(`Página 1 de 1`, pageWidth - margin - 20, footerY);

      // Salvar o PDF
      doc.save(`lancamentos-selecionados-${selectedRows.length}.pdf`);
    }).catch((error) => {
      console.error('Erro ao carregar jsPDF:', error);
      alert('Erro ao gerar PDF. Verifique se a biblioteca jsPDF está instalada.');
    });
  };

  const handleImportComplete = (result: { imported: number; errors: any[] }) => {
    if (result.imported > 0) {
      // Recarregar transações após importação bem-sucedida
      loadTransactions();

      // Mostrar mensagem de sucesso
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  };

  const generateTransactionPDF = (transaction: Transaction, account?: Account, category?: Category) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
      }).format(amount);
    };

    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).format(new Date(date));
    };

    const getTransactionTypeLabel = (type: TransactionType) => {
      const labels = {
        INCOME: "Receita",
        EXPENSE: "Despesa",
        TRANSFER: "Transferência"
      };
      return labels[type] || type;
    };

    const getTransactionStatusLabel = (status: TransactionStatus) => {
      const labels = {
        PENDING: "Pendente",
        COMPLETED: "Concluída",
        CANCELLED: "Cancelada",
        FAILED: "Falhou"
      };
      return labels[status] || status;
    };

    const amountText = `${transaction.type === "expense" ? "-" : transaction.type === "income" ? "+" : ""}${formatCurrency(Number(transaction.amount))}`;
    const typeColor = transaction.type === "expense" ? "#dc2626" : transaction.type === "income" ? "#059669" : "#3b82f6";
    const statusColor = transaction.status === "completed" ? "#059669" : transaction.status === "pending" ? "#f59e0b" : "#6b7280";

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Comprovante de Transação</title>
          <meta charset="utf-8">
          <style>
            @page { size: A4; margin: 20mm; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: #f8fafc; color: #1e293b; }
            .container { max-width: 800px; margin: 0 auto; background: white; min-height: 100vh; padding: 40px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
            .header { text-align: center; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { color: #1e293b; font-size: 28px; margin: 0 0 10px 0; font-weight: 700; }
            .header .date { color: #64748b; font-size: 14px; }
            .transaction-card { background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border: 1px solid #e2e8f0; border-radius: 12px; padding: 30px; margin-bottom: 30px; }
            .transaction-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
            .transaction-icon { width: 60px; height: 60px; background: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .transaction-info h2 { font-size: 24px; margin: 0 0 10px 0; color: #1e293b; }
            .transaction-meta { display: flex; gap: 20px; align-items: center; }
            .transaction-type { background: #e2e8f0; color: #475569; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
            .transaction-status { color: ${statusColor}; font-weight: 600; font-size: 14px; }
            .transaction-amount { font-size: 32px; font-weight: 700; color: ${typeColor}; text-align: right; }
            .details-section { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 30px; margin-bottom: 30px; }
            .details-section h3 { color: #1e293b; font-size: 18px; margin: 0 0 20px 0; font-weight: 600; }
            .detail-row { display: flex; margin-bottom: 15px; align-items: flex-start; }
            .detail-label { font-weight: 600; color: #374151; min-width: 120px; margin-right: 20px; }
            .detail-value { color: #1e293b; flex: 1; }
            .footer { text-align: center; padding-top: 30px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px; }
            .footer .system-info { margin-bottom: 10px; }
            .footer .transaction-id { font-weight: 600; }
            @media print { body { background: white; } .container { box-shadow: none; } }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Comprovante de Transação</h1>
              <div class="date">Gerado em: ${formatDate(new Date())}</div>
            </div>
            <div class="transaction-card">
              <div class="transaction-header">
                <div style="display: flex; align-items: center; gap: 20px;">
                  <div class="transaction-icon">${transaction.type === "expense" ? "↓" : transaction.type === "income" ? "↑" : "↔"}</div>
                  <div class="transaction-info">
                    <h2>${transaction.description}</h2>
                    <div class="transaction-meta">
                      <span class="transaction-type">${getTransactionTypeLabel(transaction.type)}</span>
                      <span class="transaction-status">${getTransactionStatusLabel(transaction.status)}</span>
                    </div>
                  </div>
                </div>
                <div class="transaction-amount">${amountText}</div>
              </div>
            </div>
            <div class="details-section">
              <h3>Detalhes da Transação</h3>
              <div class="detail-row">
                <div class="detail-label">Data e Hora:</div>
                <div class="detail-value">${formatDate(transaction.date)}</div>
              </div>
              ${account ? `<div class="detail-row"><div class="detail-label">Conta:</div><div class="detail-value">${account.name}${account.description ? ` (${account.description})` : ''}</div></div>` : ''}
              ${category ? `<div class="detail-row"><div class="detail-label">Categoria:</div><div class="detail-value">${category.name}</div></div>` : ''}
              ${transaction.notes ? `<div class="detail-row"><div class="detail-label">Observações:</div><div class="detail-value">${transaction.notes}</div></div>` : ''}
            </div>
            <div class="footer">
              <div class="system-info">Este documento foi gerado automaticamente pelo sistema Grex Finances</div>
              <div class="transaction-id">ID da Transação: ${transaction.id}</div>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  const printData = () => {
    if (selectedRows.length === 0) {
      alert("Selecione pelo menos uma transação para imprimir");
      return;
    }

    const selectedTransactions = (filteredTransactions || []).filter(t => selectedRows.includes(t.id));

    // Converter dados mockados para o formato da Transaction
    const transactionsForPDF = selectedTransactions.map(t => ({
      id: t.id.toString(),
      userId: "1",
      accountId: "1",
      categoryId: "1",
      description: t.description,
      amount: t.amount,
      type: t.type,
      status: t.status,
      date: new Date(),
      notes: "",
      receipt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    // Gerar PDF para múltiplas transações
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
      }).format(amount);
    };

    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).format(new Date(date));
    };

    const getTransactionTypeLabel = (type: TransactionType) => {
      const labels = {
        INCOME: "Receita",
        EXPENSE: "Despesa",
        TRANSFER: "Transferência"
      };
      return labels[type] || type;
    };

    const getTransactionStatusLabel = (status: TransactionStatus) => {
      const labels = {
        PENDING: "Pendente",
        COMPLETED: "Concluída",
        CANCELLED: "Cancelada",
        FAILED: "Falhou"
      };
      return labels[status] || status;
    };

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Relatório de Transações</title>
          <meta charset="utf-8">
          <style>
            @page { size: A4; margin: 20mm; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: #f8fafc; color: #1e293b; }
            .container { max-width: 800px; margin: 0 auto; background: white; min-height: 100vh; padding: 40px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
            .header { text-align: center; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { color: #1e293b; font-size: 28px; margin: 0 0 10px 0; font-weight: 700; }
            .header .date { color: #64748b; font-size: 14px; }
            .summary { background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 30px; text-align: center; }
            .summary h3 { margin: 0 0 10px 0; color: #1e293b; }
            .transactions-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .transactions-table th { background: #3b82f6; color: white; padding: 15px 10px; text-align: left; font-weight: 600; }
            .transactions-table td { padding: 12px 10px; border-bottom: 1px solid #e2e8f0; }
            .transactions-table tr:nth-child(even) { background: #f8fafc; }
            .amount { text-align: right; font-weight: 600; }
            .amount.income { color: #059669; }
            .amount.expense { color: #dc2626; }
            .footer { text-align: center; padding-top: 30px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px; }
            @media print { body { background: white; } .container { box-shadow: none; } }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Relatório de Transações</h1>
              <div class="date">Gerado em: ${formatDate(new Date())}</div>
            </div>
            <div class="summary">
              <h3>Resumo</h3>
              <p>Total de transações: ${transactionsForPDF.length}</p>
            </div>
            <table class="transactions-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${transactionsForPDF.map(transaction => `
                  <tr>
                    <td>${formatDate(transaction.date)}</td>
                    <td>${transaction.description}</td>
                    <td>${getTransactionTypeLabel(transaction.type)}</td>
                    <td class="amount ${transaction.type === 'income' ? 'income' : 'expense'}">
                      ${transaction.type === "expense" ? "-" : transaction.type === "income" ? "+" : ""}${formatCurrency(Number(transaction.amount))}
                    </td>
                    <td>${getTransactionStatusLabel(transaction.status)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="footer">
              <div>Este documento foi gerado automaticamente pelo sistema Grex Finances</div>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <DashboardLayout>
      <div className={styles.transactionsContainer}>
        {/* Barra de controles superior */}
        <div className={styles.controlsBar}>
          <div className={styles.leftControls}>
            <button
              className={`${styles.viewButton} ${activeView === "Mês" ? styles.active : ""}`}
              onClick={() => setActiveView("Mês")}
            >
              Mês
            </button>
            <button
              className={`${styles.viewButton} ${activeView === "Semana" ? styles.active : ""}`}
              onClick={() => setActiveView("Semana")}
            >
              Semana
            </button>
            <div className={styles.filterContainer}>
              <button
                className={styles.filterButton}
                onClick={() => setShowFiltersDropdown(!showFiltersDropdown)}
              >
                Filtros
                <ChevronDown size={14} />
              </button>

              {showFiltersDropdown && (
                <div className={styles.filtersDropdown}>
                  <div className={styles.filterSection}>
                    <label className={styles.filterLabel}>Buscar por descrição:</label>
                    <input
                      type="text"
                      className={styles.filterInput}
                      placeholder="Digite a descrição..."
                      value={filters.search}
                      onChange={(e) => updateFilter('search', e.target.value)}
                    />
                  </div>

                  <div className={styles.filterSection}>
                    <label className={styles.filterLabel}>Categoria:</label>
                    <select
                      className={styles.filterSelect}
                      value={filters.category}
                      onChange={(e) => updateFilter('category', e.target.value)}
                    >
                      <option value="">Todas as categorias</option>
                      {(categories || []).map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.filterSection}>
                    <label className={styles.filterLabel}>Tipo:</label>
                    <select
                      className={styles.filterSelect}
                      value={filters.type}
                      onChange={(e) => updateFilter('type', e.target.value)}
                    >
                      <option value="">Todos os tipos</option>
                      <option value="income">Receita</option>
                      <option value="expense">Despesa</option>
                      <option value="transfer">Transferência</option>
                    </select>
                  </div>

                  <div className={styles.filterSection}>
                    <label className={styles.filterLabel}>Status:</label>
                    <select
                      className={styles.filterSelect}
                      value={filters.status}
                      onChange={(e) => updateFilter('status', e.target.value)}
                    >
                      <option value="">Todos os status</option>
                      <option value="completed">Concluída</option>
                      <option value="pending">Pendente</option>
                      <option value="cancelled">Cancelada</option>
                    </select>
                  </div>

                  <div className={styles.filterSection}>
                    <label className={styles.filterLabel}>Data de:</label>
                    <input
                      type="date"
                      className={styles.filterInput}
                      value={filters.dateFrom}
                      onChange={(e) => updateFilter('dateFrom', e.target.value)}
                    />
                  </div>

                  <div className={styles.filterSection}>
                    <label className={styles.filterLabel}>Data até:</label>
                    <input
                      type="date"
                      className={styles.filterInput}
                      value={filters.dateTo}
                      onChange={(e) => updateFilter('dateTo', e.target.value)}
                    />
                  </div>

                  <div className={styles.filterActions}>
                    <button
                      className={styles.clearFiltersButton}
                      onClick={clearFilters}
                    >
                      Limpar Filtros
                    </button>
                    <button
                      className={styles.applyFiltersButton}
                      onClick={() => setShowFiltersDropdown(false)}
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={styles.rightControls}>
            {/* Navegação de data */}
            <div className={styles.dateNavigation}>
              <button
                className={styles.dateButton}
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft size={14} />
              </button>
              <span className={styles.currentDate}>
                {formatDate(currentDate)}
              </span>
              <button
                className={styles.dateButton}
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Botões de ação */}
            <div className={styles.actionButtons}>
              <button
                className={`${styles.actionButton} ${styles.primaryButton}`}
                onClick={() => setShowAddTransactionModal(true)}
              >
                <Plus size={16} />
                Nova Transação
              </button>
              <button className={styles.actionButton} onClick={() => setShowImportModal(true)}>
                <Upload size={16} />
                Importar
              </button>
              <button className={styles.actionButton} onClick={exportToPDF}>
                <Download size={16} />
                Exportar
              </button>
              <button className={styles.actionButton} onClick={printData}>
                <Printer size={16} />
                Imprimir
              </button>
            </div>
          </div>
        </div>

        {/* Seção de transações */}
        <div className={styles.transactionsSection}>
          <div className={styles.transactionsHeader}>
            <h2 className={styles.transactionsTitle}>{updateTransactionsTitle()}</h2>
            <div className={styles.searchContainer}>
              <Search size={16} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Localizar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>




          {/* Ações para linhas selecionadas */}
          {selectedRows.length > 0 && (
            <div className={styles.selectedActions}>
              <span className={styles.selectedCount}>
                {selectedRows.length} item(s) selecionado(s)
              </span>
              <div className={styles.actionButtons}>
                <button className={styles.actionButton} onClick={exportSelectedToPDF}>
                  <Download size={16} />
                  Exportar Selecionados
                </button>
                <button className={styles.actionButton}>
                  <Printer size={16} />
                  Imprimir Selecionados
                </button>
              </div>
            </div>
          )}

          {/* Tabela de transações */}
          <div className={styles.tableContainer}>
            <table className={styles.transactionsTable}>
              <thead>
                <tr className={styles.tableHeaderRow}>
                  <th className={styles.tableHeader}>
                    <div className={styles.headerCell}>
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={toggleSelectAll}
                        className={styles.checkbox}
                      />
                      <span>Tipo</span>
                      <ArrowUpDown size={14} className={styles.sortIcon} />
                    </div>
                  </th>
                  <th className={styles.tableHeader}>
                    <button
                      className={styles.sortableHeader}
                      onClick={() => handleSort('description')}
                    >
                      <span>Descrição</span>
                      <ArrowUpDown
                        size={14}
                        className={`${styles.sortIcon} ${sortField === 'description' ? styles.active : ''}`}
                      />
                    </button>
                  </th>
                  <th className={styles.tableHeader}>
                    <button
                      className={styles.sortableHeader}
                      onClick={() => handleSort('category')}
                    >
                      <span>Categoria</span>
                      <ArrowUpDown
                        size={14}
                        className={`${styles.sortIcon} ${sortField === 'category' ? styles.active : ''}`}
                      />
                    </button>
                  </th>
                  <th className={styles.tableHeader}>
                    <button
                      className={styles.sortableHeader}
                      onClick={() => handleSort('amount')}
                    >
                      <span>Valor</span>
                      <ArrowUpDown
                        size={14}
                        className={`${styles.sortIcon} ${sortField === 'amount' ? styles.active : ''}`}
                      />
                    </button>
                  </th>
                  <th className={styles.tableHeader}>
                    <button
                      className={styles.sortableHeader}
                      onClick={() => handleSort('status')}
                    >
                      <span>Status</span>
                      <ArrowUpDown
                        size={14}
                        className={`${styles.sortIcon} ${sortField === 'status' ? styles.active : ''}`}
                      />
                    </button>
                  </th>
                  <th className={styles.tableHeader}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      Ações
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {getSortedTransactions().map((transaction, index) => (
                  <tr
                    key={transaction.id || `transaction-${index}`}
                    className={`${styles.tableRow} ${selectedRow === transaction.id ? styles.selected : ''} ${isRowSelected(transaction.id) ? styles.rowSelected : ''}`}
                    onClick={(e) => handleRowClick(transaction.id, e)}
                  >
                    <td className={styles.tableCell}>
                      <div className={styles.typeCell}>
                        <input
                          type="checkbox"
                          checked={isRowSelected(transaction.id)}
                          onChange={() => {
                            toggleRowSelection(transaction.id);
                            setSelectedRow(transaction.id);
                          }}
                          className={styles.checkbox}
                        />
                        <Circle size={16} className={styles.circleIcon} />
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.descriptionCell}>
                        <span className={styles.description}>{transaction.description}</span>
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.categoryCell}>
                        <span className={styles.categoryText}>
                          {transaction.categoryId || 'Sem categoria'}
                        </span>
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <span className={`${styles.value} ${Number(transaction.amount) >= 0 ? styles.positive : styles.negative}`}>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(Math.abs(Number(transaction.amount)))}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.statusCell}>
                        <span className={`${styles.statusTag} ${getStatusTypeClass(transaction.status)}`}>
                          {getStatusLabel(transaction.status)}
                        </span>
                        <div className={`${styles.statusDropdownContainer} statusDropdownContainer`}>
                          <button
                            ref={getStatusButtonRef(transaction.id)}
                            className={`${styles.statusDropdownButton} statusDropdownButton`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStatusDropdown(transaction.id);
                            }}
                          >
                            <ChevronDown size={14} className={styles.dropdownIcon} />
                          </button>

                          {statusDropdowns[transaction.id] && (
                            <div className={`${styles.dropdown} ${styles.statusDropdown} statusDropdown`}>
                              {statusOptions.map((option) => (
                                <div
                                  key={option.value}
                                  className={`${styles.dropdownItem} dropdownItem`}
                                  onClick={() => {
                                    updateTransaction(transaction.id, 'status', option.value);
                                    closeAllDropdowns();
                                  }}
                                >
                                  <span className={`${styles.statusTag} ${styles[option.type]}`}>
                                    {option.label}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.actionsCell}>
                        <button
                          className={styles.actionButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewTransaction(transaction);
                          }}
                          title="Visualizar transação"
                        >
                          <Eye size={16} />
                          <span>Visualizar</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Seção de resumo de saldos */}
        <div className={styles.summarySection}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Saldo do dia</span>
            <span className={`${styles.summaryValue} ${balanceSummary.dailyBalance >= 0 ? styles.positive : styles.negative}`}>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(balanceSummary.dailyBalance)}
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Saldo previsto</span>
            <span className={`${styles.summaryValue} ${balanceSummary.expectedBalance >= 0 ? styles.positive : styles.negative}`}>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(balanceSummary.expectedBalance)}
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Saldo realizado</span>
            <span className={`${styles.summaryValue} ${balanceSummary.actualBalance >= 0 ? styles.positive : styles.negative}`}>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(balanceSummary.actualBalance)}
            </span>
          </div>
        </div>
      </div>

      {/* Toast de notificação */}
      {showSuccessMessage && (
        <Toast
          id="tx-status"
          message="Status atualizado com sucesso!"
          type="success"
          duration={3000}
          onClose={() => setShowSuccessMessage(false)}
        />
      )}

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
            type: { id: "1", name: "Conta Corrente", category: "checking" as any },
            balance: 10000,
            currency: "BRL",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }}
          category={(categories || []).find(cat => cat.id === selectedTransaction.categoryId) || null}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
          onDuplicate={handleDuplicateTransaction}
          onShare={handleShareTransaction}
          onPrint={() => {
            // Gerar PDF estilizado da transação
            generateTransactionPDF(selectedTransaction, {
              id: "1",
              userId: "1",
              name: "Conta Principal",
              type: { id: "1", name: "Conta Corrente", category: "checking" as any },
              balance: 0,
              currency: "BRL",
              description: "Conta Corrente - Banco não informado",
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date()
            }, {
              id: "1",
              name: "Alimentação",
              type: "expense" as any,
              color: "#dc2626",
              icon: "🍽️",
              isDefault: true,
              order: 1,
              createdAt: new Date(),
              updatedAt: new Date()
            });
          }}
          onExport={() => {
            // Implementar funcionalidade de exportação
            const data = {
              transaction: selectedTransaction,
              account: (accounts || []).find(acc => acc.id === selectedTransaction.accountId),
              category: selectedTransaction.categoryId
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `transacao-${selectedTransaction.id}.json`;
            link.click();
            URL.revokeObjectURL(url);
          }}
        />
      )}

      {/* Modal de Adicionar Transação */}
      <AddTransactionModal
        isOpen={showAddTransactionModal}
        onClose={() => setShowAddTransactionModal(false)}
        onSubmit={handleAddTransaction}
        accounts={accounts}
        categories={categories}
      />

      {/* Modal de Editar Transação */}
      <EditTransactionModal
        isOpen={showEditTransactionModal}
        onClose={() => {
          setShowEditTransactionModal(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleUpdateTransaction}
        transaction={editingTransaction}
        accounts={accounts}
        categories={categories}
      />

      {/* Modal de Importar Transações */}
      <ImportTransactionsModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportComplete={handleImportComplete}
        accounts={accounts}
      />
    </DashboardLayout>
  );
}
