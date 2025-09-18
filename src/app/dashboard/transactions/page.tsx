"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
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
  Eye
} from "lucide-react";
import { Toast } from "../../../components/ui/Toast";
import { TransactionViewModal } from "../../../components/modals";

export default function Transactions() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeView, setActiveView] = useState("Mês");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState(3); // Terceira linha selecionada como no modelo
  const [selectedRows, setSelectedRows] = useState<number[]>([3]); // Linhas selecionadas
  const [selectAll, setSelectAll] = useState(false); // Selecionar todos
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
  const [showBulkStatusDropdown, setShowBulkStatusDropdown] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [statusDropdowns, setStatusDropdowns] = useState<{ [key: number]: boolean }>({});
  const [showTransactionViewModal, setShowTransactionViewModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

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
      setShowBulkStatusDropdown(false);
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

  const toggleStatusDropdown = (transactionId: number) => {
    setStatusDropdowns(prev => ({
      ...prev,
      [transactionId]: !prev[transactionId]
    }));
  };

  const updateTransaction = (transactionId: number, field: 'category' | 'status', value: string) => {

    setTransactions(prevTransactions =>
      prevTransactions.map(transaction => {
        if (transaction.id === transactionId) {
          if (field === 'status') {
            // Encontrar o tipo de status baseado no valor
            const statusOption = statusOptions.find(option => option.value === value);
            return {
              ...transaction,
              status: value,
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
  const toggleRowSelection = (transactionId: number) => {
    setSelectedRows(prev => {
      if (prev.includes(transactionId)) {
        return prev.filter(id => id !== transactionId);
      } else {
        return [...prev, transactionId];
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(transactions.map(t => t.id));
    }
    setSelectAll(!selectAll);
  };

  const isRowSelected = (transactionId: number) => {
    return selectedRows.includes(transactionId);
  };

  const handleRowClick = (transactionId: number, event: React.MouseEvent) => {
    // Não fazer nada ao clicar na linha - apenas o checkbox deve selecionar
    return;
  };

  const handleViewTransaction = (transaction: any) => {
    setSelectedTransaction(transaction);
    setShowTransactionViewModal(true);
  };

  const handleCloseTransactionModal = () => {
    setShowTransactionViewModal(false);
    setSelectedTransaction(null);
  };

  const handleEditTransaction = () => {
    console.log("Editar transação:", selectedTransaction);
    // Implementar lógica de edição
  };

  const handleDeleteTransaction = () => {
    console.log("Excluir transação:", selectedTransaction);
    // Implementar lógica de exclusão
  };

  const handleDuplicateTransaction = () => {
    console.log("Duplicar transação:", selectedTransaction);
    // Implementar lógica de duplicação
  };

  const handleShareTransaction = () => {
    console.log("Compartilhar transação:", selectedTransaction);
    // Implementar lógica de compartilhamento
  };

  // Função para alterar status de múltiplas transações
  const updateSelectedTransactionsStatus = (newStatus: string) => {
    const statusOption = statusOptions.find(option => option.value === newStatus);

    setTransactions(prevTransactions =>
      prevTransactions.map(transaction => {
        if (selectedRows.includes(transaction.id)) {
          return {
            ...transaction,
            status: newStatus,
            statusType: statusOption?.type || 'neutral'
          };
        }
        return transaction;
      })
    );

    // Mostrar mensagem de sucesso
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);

    // Limpar seleção após atualização
    setSelectedRows([]);
    setSelectAll(false);
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
    // Importar jsPDF dinamicamente
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF();

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
      doc.text(`Total de lançamentos: ${transactions.length}`, margin, 60);
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

      transactions.forEach((transaction, index) => {
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
          transaction.category,
          transaction.value,
          transaction.status
        ];

        currentX = margin + 5;
        rowData.forEach((data, colIndex) => {
          // Truncar texto se muito longo
          let text = data;
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
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF();

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

      const selectedTransactions = transactions.filter(transaction =>
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
          transaction.category,
          transaction.value,
          transaction.status
        ];

        currentX = margin + 5;
        rowData.forEach((data, colIndex) => {
          // Truncar texto se muito longo
          let text = data;
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

  const importData = () => {
    // Criar input de arquivo
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.xls';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Aqui você pode implementar a lógica de importação
        console.log('Arquivo selecionado:', file.name);
        alert(`Arquivo "${file.name}" selecionado para importação. Funcionalidade será implementada.`);
      }
    };
    input.click();
  };

  const printData = () => {
    // Criar uma nova janela para impressão
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const printContent = `
        <html>
          <head>
            <title>Lançamentos - ${formatDate(currentDate)}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .header { text-align: center; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Lançamentos - ${formatDate(currentDate)}</h1>
              <p>Total: ${transactions.length} lançamentos</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th>Valor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${transactions.map(transaction => `
                  <tr>
                    <td></td>
                    <td>${transaction.description}</td>
                    <td>${transaction.category}</td>
                    <td>${transaction.value}</td>
                    <td>${transaction.status}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Estado dos lançamentos (dados da imagem)
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: "",
      description: "Lorem ipsum sit amet doll",
      category: "Outros",
      value: "R$24.534.212,00",
      status: "Status",
      statusType: "warning"
    },
    {
      id: 2,
      type: "",
      description: "Lorem ipsum sit amet doll",
      category: "Outros",
      value: "R$24.534.212,00",
      status: "Status",
      statusType: "success"
    },
    {
      id: 3,
      type: "",
      description: "Lorem ipsum sit amet doll",
      category: "Outros",
      value: "R$24.534.212,00",
      status: "Status",
      statusType: "success"
    },
    {
      id: 4,
      type: "",
      description: "Lorem ipsum sit amet doll",
      category: "Outros",
      value: "R$24.534.212,00",
      status: "Status",
      statusType: "warning"
    },
    {
      id: 5,
      type: "",
      description: "Lorem ipsum sit amet doll",
      category: "Outros",
      value: "R$24.534.212,00",
      status: "Status",
      statusType: "warning"
    }
  ]);

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
            <button className={styles.filterButton}>
              Filtros
              <ChevronDown size={14} />
            </button>
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
              <button className={styles.actionButton} onClick={importData}>
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
            <h2 className={styles.transactionsTitle}>23 Lançamentos</h2>
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
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <button
                    className={styles.actionButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowBulkStatusDropdown(!showBulkStatusDropdown);
                    }}
                  >
                    <Upload size={16} />
                    Alterar Status
                    <ChevronDown size={14} style={{ marginLeft: '4px' }} />
                  </button>

                  {showBulkStatusDropdown && (
                    <div className={styles.dropdown} style={{ top: '100%', left: '0', minWidth: '120px' }}>
                      {statusOptions.map((option) => (
                        <div
                          key={option.value}
                          className={styles.dropdownItem}
                          onClick={() => {
                            updateSelectedTransactionsStatus(option.value);
                            setShowBulkStatusDropdown(false);
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
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      Descrição
                      <ArrowUpDown size={14} className={styles.sortIcon} />
                    </span>
                  </th>
                  <th className={styles.tableHeader}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      Categoria
                      <ArrowUpDown size={14} className={styles.sortIcon} />
                    </span>
                  </th>
                  <th className={styles.tableHeader}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      Valor
                      <ArrowUpDown size={14} className={styles.sortIcon} />
                    </span>
                  </th>
                  <th className={styles.tableHeader}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      Status
                      <ArrowUpDown size={14} className={styles.sortIcon} />
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
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
                        <button
                          className={styles.viewButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewTransaction(transaction);
                          }}
                          title="Visualizar transação"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.categoryCell}>
                        <span className={styles.categoryText}>{transaction.category}</span>
                        <ChevronDown size={14} className={styles.dropdownIcon} />
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <span className={styles.value}>{transaction.value}</span>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.statusCell}>
                        <span className={`${styles.statusTag} ${styles[transaction.statusType]}`}>
                          {transaction.status}
                        </span>
                        <div className={`${styles.statusDropdownContainer} statusDropdownContainer`}>
                          <button
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
            <span className={`${styles.summaryValue} ${styles.negative}`}>R$-250,00</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Saldo previsto</span>
            <span className={styles.summaryValue}>R$-250,00</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Saldo realizado</span>
            <span className={`${styles.summaryValue} ${styles.positive}`}>R$800,00</span>
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
          category={{
            id: "1",
            name: selectedTransaction.category,
            type: "expense" as any,
            color: "#3b82f6",
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
    </DashboardLayout>
  );
}
