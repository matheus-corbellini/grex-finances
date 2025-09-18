"use client";

import React, { useState } from "react";
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
    ArrowRightLeft
} from "lucide-react";
import { Transaction, TransactionType, TransactionStatus } from "../../../shared/types/transaction.types";
import { Account } from "../../../shared/types/account.types";
import { Category } from "../../../shared/types/category.types";
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
    isLoading = false
}) => {
    const [activeTab, setActiveTab] = useState<"details" | "notes" | "attachments">("details");

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
        { id: "attachments", label: "Anexos", icon: Download }
    ] as const;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Visualizar Transação" size="medium">
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

                    <div className={styles.actions}>
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
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={onEdit}
                            disabled={isLoading}
                        >
                            <Edit size={16} />
                            Editar
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={onDelete}
                            disabled={isLoading}
                        >
                            <Trash2 size={16} />
                            Excluir
                        </Button>
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
                            <div className={styles.detailsGrid}>
                                <div className={styles.detailCard}>
                                    <h3 className={styles.detailTitle}>
                                        <Calendar size={16} />
                                        Data e Hora
                                    </h3>
                                    <div className={styles.detailValue}>
                                        {formatDate(transaction.date)}
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
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Fechar
                    </Button>
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
