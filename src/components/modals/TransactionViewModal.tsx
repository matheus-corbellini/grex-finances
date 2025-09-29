"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import {
    Receipt,
    Calendar,
    Tag,
    MapPin,
    CreditCard,
    DollarSign,
    FileText,
    Edit,
    Trash2,
    Copy,
    Share2,
    Download,
    Eye,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    TrendingUp,
    TrendingDown,
    ArrowRightLeft,
    X,
    MoreHorizontal,
    Printer,
    ExternalLink,
    BarChart3,
    PieChart,
    Star,
    Bookmark,
    Flag,
    AlertTriangle,
    Info,
    Zap,
    Target,
    Activity,
    Users,
    Building2,
    Wallet
} from "lucide-react";
import { Transaction, TransactionType, TransactionStatus } from "../../../shared/types/transaction.types";
import { Account } from "../../../shared/types/account.types";
import { Category } from "../../../shared/types/category.types";
// PDF functionality moved inline to avoid build issues
import styles from "./TransactionViewModal.module.css";

export interface TransactionViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction;
    account?: Account;
    category?: Category;
    subcategory?: any;
    onEdit?: () => void;
    onDelete?: () => void;
    onDuplicate?: () => void;
    onShare?: () => void;
    onPrint?: () => void;
    onExport?: () => void;
    isLoading?: boolean;
}

export const TransactionViewModal: React.FC<TransactionViewModalProps> = ({
    isOpen,
    onClose,
    transaction,
    account,
    category,
    subcategory,
    onEdit,
    onDelete,
    onDuplicate,
    onShare,
    onPrint,
    onExport,
    isLoading = false
}) => {
    const [activeTab, setActiveTab] = useState<"details" | "notes" | "attachments" | "analytics">("details");
    const [showMoreActions, setShowMoreActions] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isFlagged, setIsFlagged] = useState(false);

    const formatCurrency = (amount: number, currency: string = "BRL") => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: currency
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

    const generateTransactionPDF = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const amountText = `${transaction.type === "expense" ? "-" : transaction.type === "income" ? "+" : ""}${formatCurrency(transaction.amount)}`;
        const typeColor = transaction.type === "expense" ? "#dc2626" : transaction.type === "income" ? "#059669" : "#3b82f6";
        const statusColor = transaction.status === "completed" ? "#059669" : transaction.status === "pending" ? "#f59e0b" : "#6b7280";

        const printContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Comprovante de Transação</title>
              <meta charset="utf-8">
              <style>
                @page {
                  size: A4;
                  margin: 20mm;
                }
                body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  margin: 0;
                  padding: 0;
                  background: #f8fafc;
                  color: #1e293b;
                }
                .container {
                  max-width: 800px;
                  margin: 0 auto;
                  background: white;
                  min-height: 100vh;
                  padding: 40px;
                  box-shadow: 0 0 20px rgba(0,0,0,0.1);
                }
                .header {
                  text-align: center;
                  border-bottom: 3px solid #3b82f6;
                  padding-bottom: 20px;
                  margin-bottom: 30px;
                }
                .header h1 {
                  color: #1e293b;
                  font-size: 28px;
                  margin: 0 0 10px 0;
                  font-weight: 700;
                }
                .header .date {
                  color: #64748b;
                  font-size: 14px;
                }
                .transaction-card {
                  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                  border: 1px solid #e2e8f0;
                  border-radius: 12px;
                  padding: 30px;
                  margin-bottom: 30px;
                }
                .transaction-header {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  margin-bottom: 20px;
                }
                .transaction-icon {
                  width: 60px;
                  height: 60px;
                  background: white;
                  border-radius: 12px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 24px;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                .transaction-info h2 {
                  font-size: 24px;
                  margin: 0 0 10px 0;
                  color: #1e293b;
                }
                .transaction-meta {
                  display: flex;
                  gap: 20px;
                  align-items: center;
                }
                .transaction-type {
                  background: #e2e8f0;
                  color: #475569;
                  padding: 6px 16px;
                  border-radius: 20px;
                  font-size: 12px;
                  font-weight: 600;
                  text-transform: uppercase;
                }
                .transaction-status {
                  color: ${statusColor};
                  font-weight: 600;
                  font-size: 14px;
                }
                .transaction-amount {
                  font-size: 32px;
                  font-weight: 700;
                  color: ${typeColor};
                  text-align: right;
                }
                .details-section {
                  background: white;
                  border: 1px solid #e2e8f0;
                  border-radius: 12px;
                  padding: 30px;
                  margin-bottom: 30px;
                }
                .details-section h3 {
                  color: #1e293b;
                  font-size: 18px;
                  margin: 0 0 20px 0;
                  font-weight: 600;
                }
                .detail-row {
                  display: flex;
                  margin-bottom: 15px;
                  align-items: flex-start;
                }
                .detail-label {
                  font-weight: 600;
                  color: #374151;
                  min-width: 120px;
                  margin-right: 20px;
                }
                .detail-value {
                  color: #1e293b;
                  flex: 1;
                }
                .footer {
                  text-align: center;
                  padding-top: 30px;
                  border-top: 1px solid #e2e8f0;
                  color: #64748b;
                  font-size: 12px;
                }
                .footer .system-info {
                  margin-bottom: 10px;
                }
                .footer .transaction-id {
                  font-weight: 600;
                }
                @media print {
                  body { background: white; }
                  .container { box-shadow: none; }
                }
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
                      <div class="transaction-icon">
                        ${transaction.type === "expense" ? "↓" : transaction.type === "income" ? "↑" : "↔"}
                      </div>
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

                  ${account ? `
                    <div class="detail-row">
                      <div class="detail-label">Conta:</div>
                      <div class="detail-value">${account.name}${account.description ? ` (${account.description})` : ''}</div>
                    </div>
                  ` : ''}

                  ${category ? `
                    <div class="detail-row">
                      <div class="detail-label">Categoria:</div>
                      <div class="detail-value">${category.name}</div>
                    </div>
                  ` : ''}

                  ${transaction.notes ? `
                    <div class="detail-row">
                      <div class="detail-label">Observações:</div>
                      <div class="detail-value">${transaction.notes}</div>
                    </div>
                  ` : ''}
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

        // Aguardar um pouco para o conteúdo carregar antes de imprimir
        setTimeout(() => {
            printWindow.print();
        }, 500);
    };

    const getTransactionTypeIcon = (type: TransactionType) => {
        switch (type) {
            case "income":
                return <TrendingUp size={20} className={styles.typeIconIncome} />;
            case "expense":
                return <TrendingDown size={20} className={styles.typeIconExpense} />;
            case "transfer":
                return <ArrowRightLeft size={20} className={styles.typeIconTransfer} />;
            default:
                return <DollarSign size={20} />;
        }
    };

    const getTransactionStatusIcon = (status: TransactionStatus) => {
        switch (status) {
            case "completed":
                return <CheckCircle size={16} className={styles.statusIconCompleted} />;
            case "pending":
                return <Clock size={16} className={styles.statusIconPending} />;
            case "cancelled":
                return <XCircle size={16} className={styles.statusIconCancelled} />;
            case "failed":
                return <AlertCircle size={16} className={styles.statusIconFailed} />;
            default:
                return <Clock size={16} />;
        }
    };

    const getTransactionTypeColor = (type: TransactionType) => {
        switch (type) {
            case "income":
                return "#059669";
            case "expense":
                return "#dc2626";
            case "transfer":
                return "#3b82f6";
            default:
                return "#6b7280";
        }
    };

    const tabs = [
        { id: "details", label: "Detalhes", icon: Receipt },
        { id: "notes", label: "Observações", icon: FileText },
        { id: "attachments", label: "Anexos", icon: Download },
        { id: "analytics", label: "Análise", icon: BarChart3 }
    ] as const;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Visualizar Transação" size="large">
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.transactionInfo}>
                        <div className={styles.transactionHeader}>
                            <div className={styles.transactionIcon}>
                                {getTransactionTypeIcon(transaction.type)}
                            </div>
                            <div className={styles.transactionDetails}>
                                <h2 className={styles.transactionTitle}>{transaction.description}</h2>
                                <div className={styles.transactionMeta}>
                                    <span className={styles.transactionType}>
                                        {getTransactionTypeLabel(transaction.type)}
                                    </span>
                                    <span className={styles.transactionStatus}>
                                        {getTransactionStatusIcon(transaction.status)}
                                        {getTransactionStatusLabel(transaction.status)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.transactionAmount}>
                            <span
                                className={styles.amount}
                                style={{ color: getTransactionTypeColor(transaction.type) }}
                            >
                                {transaction.type === "expense" ? "-" : transaction.type === "income" ? "+" : ""}
                                {formatCurrency(transaction.amount)}
                            </span>
                        </div>
                    </div>

                    <div className={styles.headerActions}>
                        <div className={styles.primaryActions}>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={onDuplicate}
                                disabled={isLoading}
                            >
                                <Copy size={16} />
                                Duplicar
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={onShare}
                                disabled={isLoading}
                            >
                                <Share2 size={16} />
                                Compartilhar
                            </Button>
                        </div>

                        <div className={styles.moreActions}>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setShowMoreActions(!showMoreActions)}
                                disabled={isLoading}
                            >
                                <MoreHorizontal size={16} />
                            </Button>

                            {showMoreActions && (
                                <div className={styles.moreActionsDropdown}>
                                    <button
                                        onClick={() => {
                                            generateTransactionPDF();
                                            if (onPrint) onPrint();
                                        }}
                                        className={styles.dropdownItem}
                                    >
                                        <Printer size={16} />
                                        Imprimir PDF
                                    </button>
                                    <button onClick={onExport} className={styles.dropdownItem}>
                                        <Download size={16} />
                                        Exportar
                                    </button>
                                    <button onClick={onEdit} className={styles.dropdownItem}>
                                        <Edit size={16} />
                                        Editar
                                    </button>
                                    <button onClick={onDelete} className={`${styles.dropdownItem} ${styles.dangerItem}`}>
                                        <Trash2 size={16} />
                                        Excluir
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className={styles.tabNavigation}>
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <Icon size={16} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className={styles.tabContent}>
                    {activeTab === "details" && (
                        <div className={styles.detailsSection}>
                            {/* Informações Principais */}
                            <div className={styles.detailsGrid}>
                                <div className={styles.detailCard}>
                                    <h3 className={styles.detailTitle}>
                                        <Calendar size={16} />
                                        Data e Hora
                                    </h3>
                                    <div className={styles.detailValue}>
                                        {formatDate(transaction.date)}
                                    </div>
                                    <div className={styles.detailSubtext}>
                                        {new Date(transaction.date).toLocaleDateString('pt-BR', { weekday: 'long' })}
                                    </div>
                                </div>

                                <div className={styles.detailCard}>
                                    <h3 className={styles.detailTitle}>
                                        <CreditCard size={16} />
                                        Conta
                                    </h3>
                                    <div className={styles.detailValue}>
                                        {account?.name || "Conta não encontrada"}
                                    </div>
                                    {account && (
                                        <div className={styles.detailSubtext}>
                                            {account.type?.name} • {account.bankName || "Banco não informado"}
                                        </div>
                                    )}
                                </div>

                                {category && (
                                    <div className={styles.detailCard}>
                                        <h3 className={styles.detailTitle}>
                                            <Tag size={16} />
                                            Categoria
                                        </h3>
                                        <div className={styles.categoryInfo}>
                                            <div
                                                className={styles.categoryColor}
                                                style={{ backgroundColor: category.color }}
                                            />
                                            <div className={styles.categoryDetails}>
                                                <div className={styles.detailValue}>{category.name}</div>
                                                {subcategory && (
                                                    <div className={styles.detailSubtext}>
                                                        Subcategoria: {subcategory.name}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className={styles.detailCard}>
                                    <h3 className={styles.detailTitle}>
                                        <DollarSign size={16} />
                                        Valor
                                    </h3>
                                    <div className={styles.detailValue}>
                                        {formatCurrency(transaction.amount)}
                                    </div>
                                    <div className={styles.detailSubtext}>
                                        {transaction.type === "expense" ? "Despesa" : transaction.type === "income" ? "Receita" : "Transferência"}
                                    </div>
                                </div>

                                {transaction.location && (
                                    <div className={styles.detailCard}>
                                        <h3 className={styles.detailTitle}>
                                            <MapPin size={16} />
                                            Localização
                                        </h3>
                                        <div className={styles.detailValue}>
                                            {transaction.location}
                                        </div>
                                    </div>
                                )}

                                {transaction.tags && transaction.tags.length > 0 && (
                                    <div className={styles.detailCard}>
                                        <h3 className={styles.detailTitle}>
                                            <Tag size={16} />
                                            Tags
                                        </h3>
                                        <div className={styles.tagsList}>
                                            {transaction.tags.map((tag, index) => (
                                                <span key={index} className={styles.tag}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Informações Adicionais */}
                            <div className={styles.additionalInfo}>
                                <h3 className={styles.sectionTitle}>Informações Adicionais</h3>
                                <div className={styles.detailsGrid}>
                                    <div className={styles.detailCard}>
                                        <h3 className={styles.detailTitle}>
                                            <Clock size={16} />
                                            Criado em
                                        </h3>
                                        <div className={styles.detailValue}>
                                            {formatDate(transaction.createdAt)}
                                        </div>
                                    </div>

                                    {transaction.updatedAt && transaction.updatedAt !== transaction.createdAt && (
                                        <div className={styles.detailCard}>
                                            <h3 className={styles.detailTitle}>
                                                <Edit size={16} />
                                                Atualizado em
                                            </h3>
                                            <div className={styles.detailValue}>
                                                {formatDate(transaction.updatedAt)}
                                            </div>
                                        </div>
                                    )}

                                    {transaction.isRecurring && (
                                        <div className={styles.detailCard}>
                                            <h3 className={styles.detailTitle}>
                                                <Clock size={16} />
                                                Transação Recorrente
                                            </h3>
                                            <div className={styles.detailValue}>
                                                Sim
                                            </div>
                                            {transaction.recurringTransactionId && (
                                                <div className={styles.detailSubtext}>
                                                    ID: {transaction.recurringTransactionId}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className={styles.detailCard}>
                                        <h3 className={styles.detailTitle}>
                                            <Activity size={16} />
                                            Status
                                        </h3>
                                        <div className={styles.statusInfo}>
                                            {getTransactionStatusIcon(transaction.status)}
                                            <span className={styles.detailValue}>
                                                {getTransactionStatusLabel(transaction.status)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Ações Rápidas */}
                            <div className={styles.quickActions}>
                                <h3 className={styles.sectionTitle}>Ações Rápidas</h3>
                                <div className={styles.quickActionsGrid}>
                                    <button
                                        className={`${styles.quickAction} ${isBookmarked ? styles.active : ''}`}
                                        onClick={() => setIsBookmarked(!isBookmarked)}
                                    >
                                        <Star size={16} />
                                        {isBookmarked ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                                    </button>
                                    <button
                                        className={`${styles.quickAction} ${isFlagged ? styles.active : ''}`}
                                        onClick={() => setIsFlagged(!isFlagged)}
                                    >
                                        <Flag size={16} />
                                        {isFlagged ? 'Remover Marcação' : 'Marcar como Importante'}
                                    </button>
                                    <button className={styles.quickAction} onClick={onDuplicate}>
                                        <Copy size={16} />
                                        Duplicar Transação
                                    </button>
                                    <button className={styles.quickAction} onClick={onShare}>
                                        <Share2 size={16} />
                                        Compartilhar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "notes" && (
                        <div className={styles.notesSection}>
                            <h3 className={styles.sectionTitle}>Observações</h3>
                            {transaction.notes ? (
                                <div className={styles.notesContent}>
                                    <p>{transaction.notes}</p>
                                </div>
                            ) : (
                                <div className={styles.emptyState}>
                                    <FileText size={48} />
                                    <h4>Nenhuma observação</h4>
                                    <p>Esta transação não possui observações adicionais.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "attachments" && (
                        <div className={styles.attachmentsSection}>
                            <h3 className={styles.sectionTitle}>Anexos</h3>
                            {transaction.receipt ? (
                                <div className={styles.attachmentItem}>
                                    <div className={styles.attachmentIcon}>
                                        <Receipt size={24} />
                                    </div>
                                    <div className={styles.attachmentInfo}>
                                        <div className={styles.attachmentName}>Comprovante</div>
                                        <div className={styles.attachmentSize}>Arquivo anexado</div>
                                    </div>
                                    <div className={styles.attachmentActions}>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => window.open(transaction.receipt, '_blank')}
                                        >
                                            <Eye size={16} />
                                            Visualizar
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => {
                                                const link = document.createElement('a');
                                                link.href = transaction.receipt!;
                                                link.download = `comprovante-${transaction.id}`;
                                                link.click();
                                            }}
                                        >
                                            <Download size={16} />
                                            Baixar
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.emptyState}>
                                    <Download size={48} />
                                    <h4>Nenhum anexo</h4>
                                    <p>Esta transação não possui anexos.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "analytics" && (
                        <div className={styles.analyticsSection}>
                            <h3 className={styles.sectionTitle}>Análise da Transação</h3>

                            {/* Resumo Executivo */}
                            <div className={styles.executiveSummary}>
                                <div className={styles.summaryCard}>
                                    <div className={styles.summaryIcon}>
                                        <Target size={24} />
                                    </div>
                                    <div className={styles.summaryContent}>
                                        <h4>Resumo Executivo</h4>
                                        <p>Esta transação representa <strong>5.2%</strong> do seu orçamento mensal e está dentro da média esperada para esta categoria.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Métricas Principais */}
                            <div className={styles.analyticsGrid}>
                                <div className={styles.analyticsCard}>
                                    <div className={styles.analyticsIcon}>
                                        <BarChart3 size={24} />
                                    </div>
                                    <div className={styles.analyticsContent}>
                                        <h4>Impacto no Orçamento</h4>
                                        <p>Esta transação representa <strong>5.2%</strong> do seu orçamento mensal.</p>
                                        <div className={styles.progressBar}>
                                            <div className={styles.progressFill} style={{ width: '52%' }}></div>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.analyticsCard}>
                                    <div className={styles.analyticsIcon}>
                                        <PieChart size={24} />
                                    </div>
                                    <div className={styles.analyticsContent}>
                                        <h4>Gastos na Categoria</h4>
                                        <p>Você gastou <strong>R$ 150,00</strong> nesta categoria este mês.</p>
                                        <div className={styles.categoryStats}>
                                            <span className={styles.statItem}>
                                                <strong>R$ 50,00</strong> esta semana
                                            </span>
                                            <span className={styles.statItem}>
                                                <strong>R$ 200,00</strong> mês passado
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.analyticsCard}>
                                    <div className={styles.analyticsIcon}>
                                        <TrendingDown size={24} />
                                    </div>
                                    <div className={styles.analyticsContent}>
                                        <h4>Tendência</h4>
                                        <p>Gastos similares <strong>diminuíram 12%</strong> comparado ao mês anterior.</p>
                                        <div className={styles.trendIndicator}>
                                            <TrendingDown size={16} className={styles.trendDown} />
                                            <span className={styles.trendText}>Tendência de redução</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.analyticsCard}>
                                    <div className={styles.analyticsIcon}>
                                        <Calendar size={24} />
                                    </div>
                                    <div className={styles.analyticsContent}>
                                        <h4>Frequência</h4>
                                        <p>Você faz transações similares <strong>3x por semana</strong> em média.</p>
                                        <div className={styles.frequencyStats}>
                                            <span className={styles.freqItem}>Última: há 2 dias</span>
                                            <span className={styles.freqItem}>Próxima: em 2 dias</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Insights Adicionais */}
                            <div className={styles.insightsSection}>
                                <h3 className={styles.sectionTitle}>Insights</h3>
                                <div className={styles.insightsGrid}>
                                    <div className={styles.insightCard}>
                                        <div className={styles.insightIcon}>
                                            <AlertTriangle size={20} />
                                        </div>
                                        <div className={styles.insightContent}>
                                            <h4>Alerta de Orçamento</h4>
                                            <p>Você está próximo do limite mensal para esta categoria (85% usado).</p>
                                        </div>
                                    </div>

                                    <div className={styles.insightCard}>
                                        <div className={styles.insightIcon}>
                                            <Zap size={20} />
                                        </div>
                                        <div className={styles.insightContent}>
                                            <h4>Oportunidade de Economia</h4>
                                            <p>Considere negociar desconto ou buscar alternativas mais baratas.</p>
                                        </div>
                                    </div>

                                    <div className={styles.insightCard}>
                                        <div className={styles.insightIcon}>
                                            <Info size={20} />
                                        </div>
                                        <div className={styles.insightContent}>
                                            <h4>Padrão Identificado</h4>
                                            <p>Você tende a fazer este tipo de gasto nas segundas-feiras.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <div className={styles.footerLeft}>
                        <Button
                            variant="secondary"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            <X size={16} />
                            Fechar
                        </Button>
                    </div>
                    <div className={styles.footerActions}>
                        <Button
                            variant="secondary"
                            onClick={onDuplicate}
                            disabled={isLoading}
                        >
                            <Copy size={16} />
                            Duplicar
                        </Button>
                        <Button
                            variant="primary"
                            onClick={onEdit}
                            disabled={isLoading}
                        >
                            <Edit size={16} />
                            Editar Transação
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
