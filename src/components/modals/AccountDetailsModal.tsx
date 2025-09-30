"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import {
    CreditCard,
    Building2,
    DollarSign,
    Calendar,
    TrendingUp,
    TrendingDown,
    Activity,
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
    BarChart3,
    PieChart,
    ArrowUpRight,
    ArrowDownRight,
    RefreshCw
} from "lucide-react";
import { Account, AccountType, AccountCategory } from "../../../shared/types/account.types";
import { Transaction } from "../../../shared/types/transaction.types";
import styles from "./AccountDetailsModal.module.css";

export interface AccountDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    account: Account;
    accountType?: AccountType;
    recentTransactions?: Transaction[];
    balanceHistory?: Array<{ date: Date; balance: number }>;
    onEdit?: () => void;
    onDelete?: () => void;
    onExport?: () => void;
    onShare?: () => void;
    isLoading?: boolean;
}

export const AccountDetailsModal: React.FC<AccountDetailsModalProps> = ({
    isOpen,
    onClose,
    account,
    accountType,
    recentTransactions = [],
    balanceHistory = [],
    onEdit,
    onDelete,
    onExport,
    onShare,
    isLoading = false
}) => {
    const [activeTab, setActiveTab] = useState<"overview" | "transactions" | "history" | "settings">("overview");

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
            year: "numeric"
        }).format(new Date(date));
    };

    const formatDateTime = (date: Date) => {
        return new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }).format(new Date(date));
    };

    const getAccountCategoryLabel = (category: AccountCategory) => {
        const labels = {
            CHECKING: "Conta Corrente",
            SAVINGS: "Poupança",
            CREDIT_CARD: "Cartão de Crédito",
            INVESTMENT: "Investimento",
            CASH: "Dinheiro",
            LOAN: "Empréstimo",
            OTHER: "Outro"
        };
        return labels[category] || category;
    };

    const getAccountCategoryIcon = (category: AccountCategory) => {
        switch (category) {
            case AccountCategory.CHECKING:
                return <CreditCard size={20} className={styles.categoryIconChecking} />;
            case AccountCategory.SAVINGS:
                return <Building2 size={20} className={styles.categoryIconSavings} />;
            case AccountCategory.CREDIT_CARD:
                return <CreditCard size={20} className={styles.categoryIconCredit} />;
            case AccountCategory.INVESTMENT:
                return <TrendingUp size={20} className={styles.categoryIconInvestment} />;
            case AccountCategory.CASH:
                return <DollarSign size={20} className={styles.categoryIconCash} />;
            case AccountCategory.LOAN:
                return <TrendingDown size={20} className={styles.categoryIconLoan} />;
            default:
                return <CreditCard size={20} />;
        }
    };

    const getAccountCategoryColor = (category: AccountCategory) => {
        switch (category) {
            case AccountCategory.CHECKING:
                return "#3b82f6";
            case AccountCategory.SAVINGS:
                return "#059669";
            case AccountCategory.CREDIT_CARD:
                return "#dc2626";
            case AccountCategory.INVESTMENT:
                return "#7c3aed";
            case AccountCategory.CASH:
                return "#f59e0b";
            case AccountCategory.LOAN:
                return "#ef4444";
            default:
                return "#6b7280";
        }
    };

    const getStatusIcon = (isActive: boolean) => {
        return isActive ?
            <CheckCircle size={16} className={styles.statusIconActive} /> :
            <XCircle size={16} className={styles.statusIconInactive} />;
    };

    const calculateBalanceChange = () => {
        if (balanceHistory.length < 2) return { change: 0, percentage: 0 };

        const currentBalance = balanceHistory[balanceHistory.length - 1].balance;
        const previousBalance = balanceHistory[balanceHistory.length - 2].balance;
        const change = currentBalance - previousBalance;
        const percentage = previousBalance !== 0 ? (change / previousBalance) * 100 : 0;

        return { change, percentage };
    };

    const tabs = [
        { id: "overview", label: "Visão Geral", icon: Eye },
        { id: "transactions", label: "Transações", icon: Activity },
        { id: "history", label: "Histórico", icon: BarChart3 },
        { id: "settings", label: "Configurações", icon: Edit }
    ] as const;

    const balanceChange = calculateBalanceChange();

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detalhes da Conta" size="large">
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.accountInfo}>
                        <div className={styles.accountHeader}>
                            <div className={styles.accountIcon}>
                                {account.color && (
                                    <div
                                        className={styles.accountColorIndicator}
                                        style={{ backgroundColor: account.color }}
                                    />
                                )}
                                {accountType && getAccountCategoryIcon(accountType.category)}
                            </div>
                            <div className={styles.accountDetails}>
                                <h2 className={styles.accountTitle}>{account.name}</h2>
                                <div className={styles.accountBalance}>
                                    <div className={styles.balanceAmount}>
                                        {formatCurrency(account.balance, account.currency)}
                                    </div>
                                    {balanceHistory.length >= 2 && (
                                        <div className={`${styles.balanceChange} ${balanceChange.change >= 0 ? styles.balanceChangePositive : styles.balanceChangeNegative
                                            }`}>
                                            {balanceChange.change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                            {formatCurrency(Math.abs(balanceChange.change))} ({balanceChange.percentage.toFixed(1)}%)
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={styles.actions}>
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
                                onClick={onExport}
                                disabled={isLoading}
                            >
                                <Download size={16} />
                                Exportar
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

                        <div className={styles.accountMeta}>
                            <div className={styles.accountMetaRow}>
                                <span className={styles.accountType}>
                                    {accountType?.name || "Conta Bancária"}
                                </span>
                                <span className={styles.accountStatus}>
                                    {getStatusIcon(account.isActive)}
                                    {account.isActive ? "Ativa" : "Inativa"}
                                </span>
                            </div>
                            <div className={styles.accountMetaSecondary}>
                                <span className={styles.accountCategory}>
                                    {accountType ? getAccountCategoryLabel(accountType.category) : "Conta Corrente"}
                                </span>
                            </div>
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
                    {activeTab === "overview" && (
                        <div className={styles.overviewSection}>
                            <div className={styles.overviewGrid}>
                                <div className={styles.overviewCard}>
                                    <h3 className={styles.cardTitle}>
                                        <Building2 size={16} />
                                        Informações Bancárias
                                    </h3>
                                    <div className={styles.cardContent}>
                                        {account.bankName && (
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>Banco:</span>
                                                <span className={styles.infoValue}>{account.bankName}</span>
                                            </div>
                                        )}
                                        {account.accountNumber && (
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>Número da Conta:</span>
                                                <span className={styles.infoValue}>{account.accountNumber}</span>
                                            </div>
                                        )}
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>Moeda:</span>
                                            <span className={styles.infoValue}>{account.currency}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.overviewCard}>
                                    <h3 className={styles.cardTitle}>
                                        <Calendar size={16} />
                                        Datas
                                    </h3>
                                    <div className={styles.cardContent}>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>Criada em:</span>
                                            <span className={styles.infoValue}>{formatDate(account.createdAt)}</span>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>Última atualização:</span>
                                            <span className={styles.infoValue}>{formatDate(account.updatedAt)}</span>
                                        </div>
                                    </div>
                                </div>

                                {account.description && (
                                    <div className={styles.overviewCard}>
                                        <h3 className={styles.cardTitle}>
                                            <Eye size={16} />
                                            Descrição
                                        </h3>
                                        <div className={styles.cardContent}>
                                            <p className={styles.description}>{account.description}</p>
                                        </div>
                                    </div>
                                )}

                                <div className={styles.overviewCard}>
                                    <h3 className={styles.cardTitle}>
                                        <Activity size={16} />
                                        Estatísticas
                                    </h3>
                                    <div className={styles.cardContent}>
                                        <div className={styles.statItem}>
                                            <span className={styles.statLabel}>Transações Recentes:</span>
                                            <span className={styles.statValue}>{recentTransactions.length}</span>
                                        </div>
                                        <div className={styles.statItem}>
                                            <span className={styles.statLabel}>Status:</span>
                                            <span className={`${styles.statValue} ${account.isActive ? styles.statusActive : styles.statusInactive}`}>
                                                {account.isActive ? "Ativa" : "Inativa"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "transactions" && (
                        <div className={styles.transactionsSection}>
                            <h3 className={styles.sectionTitle}>Transações Recentes</h3>
                            {recentTransactions.length > 0 ? (
                                <div className={styles.transactionsList}>
                                    {recentTransactions.slice(0, 10).map((transaction) => (
                                        <div key={transaction.id} className={styles.transactionItem}>
                                            <div className={styles.transactionIcon}>
                                                {transaction.type === "income" ? (
                                                    <TrendingUp size={16} className={styles.transactionIconIncome} />
                                                ) : transaction.type === "expense" ? (
                                                    <TrendingDown size={16} className={styles.transactionIconExpense} />
                                                ) : (
                                                    <ArrowUpRight size={16} className={styles.transactionIconTransfer} />
                                                )}
                                            </div>
                                            <div className={styles.transactionDetails}>
                                                <div className={styles.transactionDescription}>
                                                    {transaction.description}
                                                </div>
                                                <div className={styles.transactionDate}>
                                                    {formatDateTime(transaction.date)}
                                                </div>
                                            </div>
                                            <div className={`${styles.transactionAmount} ${transaction.type === "income" ? styles.amountIncome :
                                                transaction.type === "expense" ? styles.amountExpense :
                                                    styles.amountTransfer
                                                }`}>
                                                {transaction.type === "expense" ? "-" : transaction.type === "income" ? "+" : ""}
                                                {formatCurrency(transaction.amount, account.currency)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.emptyState}>
                                    <Activity size={48} />
                                    <h4>Nenhuma transação</h4>
                                    <p>Esta conta ainda não possui transações registradas.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "history" && (
                        <div className={styles.historySection}>
                            <h3 className={styles.sectionTitle}>Histórico de Saldo</h3>
                            {balanceHistory.length > 0 ? (
                                <div className={styles.historyContent}>
                                    <div className={styles.historyChart}>
                                        <div className={styles.chartPlaceholder}>
                                            <BarChart3 size={48} />
                                            <p>Gráfico de Evolução do Saldo</p>
                                            <small>{balanceHistory.length} pontos de dados</small>
                                        </div>
                                    </div>
                                    <div className={styles.historyStats}>
                                        <div className={styles.statCard}>
                                            <div className={styles.statHeader}>
                                                <TrendingUp size={16} />
                                                <span>Saldo Máximo</span>
                                            </div>
                                            <div className={styles.statValue}>
                                                {formatCurrency(Math.max(...balanceHistory.map(h => h.balance)), account.currency)}
                                            </div>
                                        </div>
                                        <div className={styles.statCard}>
                                            <div className={styles.statHeader}>
                                                <TrendingDown size={16} />
                                                <span>Saldo Mínimo</span>
                                            </div>
                                            <div className={styles.statValue}>
                                                {formatCurrency(Math.min(...balanceHistory.map(h => h.balance)), account.currency)}
                                            </div>
                                        </div>
                                        <div className={styles.statCard}>
                                            <div className={styles.statHeader}>
                                                <RefreshCw size={16} />
                                                <span>Variação Total</span>
                                            </div>
                                            <div className={`${styles.statValue} ${balanceChange.change >= 0 ? styles.positive : styles.negative
                                                }`}>
                                                {balanceChange.change >= 0 ? "+" : ""}
                                                {formatCurrency(balanceChange.change, account.currency)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.emptyState}>
                                    <BarChart3 size={48} />
                                    <h4>Sem histórico</h4>
                                    <p>Esta conta ainda não possui histórico de saldo suficiente.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "settings" && (
                        <div className={styles.settingsSection}>
                            <h3 className={styles.sectionTitle}>Configurações da Conta</h3>

                            <div className={styles.settingsGrid}>
                                <div className={styles.settingCard}>
                                    <h4 className={styles.settingTitle}>Informações Básicas</h4>
                                    <div className={styles.settingContent}>
                                        <div className={styles.settingItem}>
                                            <span className={styles.settingLabel}>Nome da Conta:</span>
                                            <span className={styles.settingValue}>{account.name}</span>
                                        </div>
                                        <div className={styles.settingItem}>
                                            <span className={styles.settingLabel}>Tipo:</span>
                                            <span className={styles.settingValue}>{accountType?.name || "Não definido"}</span>
                                        </div>
                                        <div className={styles.settingItem}>
                                            <span className={styles.settingLabel}>Moeda:</span>
                                            <span className={styles.settingValue}>{account.currency}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.settingCard}>
                                    <h4 className={styles.settingTitle}>Status e Controle</h4>
                                    <div className={styles.settingContent}>
                                        <div className={styles.settingItem}>
                                            <span className={styles.settingLabel}>Status:</span>
                                            <span className={`${styles.settingValue} ${account.isActive ? styles.statusActive : styles.statusInactive}`}>
                                                {account.isActive ? "Ativa" : "Inativa"}
                                            </span>
                                        </div>
                                        <div className={styles.settingItem}>
                                            <span className={styles.settingLabel}>Saldo Atual:</span>
                                            <span className={styles.settingValue}>
                                                {formatCurrency(account.balance, account.currency)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {account.color && (
                                    <div className={styles.settingCard}>
                                        <h4 className={styles.settingTitle}>Personalização</h4>
                                        <div className={styles.settingContent}>
                                            <div className={styles.settingItem}>
                                                <span className={styles.settingLabel}>Cor:</span>
                                                <div className={styles.colorPreview}>
                                                    <div
                                                        className={styles.colorSwatch}
                                                        style={{ backgroundColor: account.color }}
                                                    />
                                                    <span className={styles.settingValue}>{account.color}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
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
                            onClick={onExport}
                            disabled={isLoading}
                        >
                            <Download size={16} />
                            Exportar
                        </Button>
                        <Button
                            variant="primary"
                            onClick={onEdit}
                            disabled={isLoading}
                        >
                            <Edit size={16} />
                            Editar Conta
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
