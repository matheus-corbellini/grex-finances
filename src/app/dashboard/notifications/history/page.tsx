"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../../../../components/layout";
import { useToastNotifications } from "../../../../hooks/useToastNotifications";
import {
    Bell,
    Filter,
    Search,
    RefreshCw,
    Download,
    Eye,
    EyeOff,
    Trash2,
    CheckCircle,
    AlertTriangle,
    Info,
    Mail,
    Smartphone,
    MessageSquare,
    Calendar,
    Clock,
    User,
    DollarSign,
    Shield,
    Database,
    Settings
} from "lucide-react";
import styles from "./NotificationHistory.module.css";

interface Notification {
    id: string;
    type: "email" | "push" | "sms" | "in_app";
    category: "transaction" | "user" | "system" | "security" | "report" | "backup";
    title: string;
    message: string;
    status: "sent" | "delivered" | "failed" | "pending";
    priority: "low" | "medium" | "high" | "urgent";
    timestamp: Date;
    read: boolean;
    recipient: string;
    channel: string;
    metadata?: any;
    errorMessage?: string;
}

interface FilterOptions {
    type: string;
    category: string;
    status: string;
    priority: string;
    dateRange: {
        start: string;
        end: string;
    };
    read: string;
}

export default function NotificationHistoryPage() {
    const toast = useToastNotifications();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

    const [filters, setFilters] = useState<FilterOptions>({
        type: "all",
        category: "all",
        status: "all",
        priority: "all",
        dateRange: {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            end: new Date().toISOString().split('T')[0]
        },
        read: "all"
    });

    // Mock data
    useEffect(() => {
        const mockNotifications: Notification[] = [
            {
                id: "1",
                type: "email",
                category: "transaction",
                title: "Nova transação registrada",
                message: "Uma nova transação de R$ 150,00 foi registrada na conta Corrente Principal",
                status: "delivered",
                priority: "medium",
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                read: true,
                recipient: "admin@igreja.com",
                channel: "Email",
                metadata: {
                    transactionId: "txn_123",
                    amount: 150.00,
                    accountName: "Corrente Principal"
                }
            },
            {
                id: "2",
                type: "push",
                category: "security",
                title: "Tentativa de login suspeita",
                message: "Detectamos uma tentativa de login de um novo dispositivo",
                status: "sent",
                priority: "high",
                timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
                read: false,
                recipient: "admin@igreja.com",
                channel: "Push Notification",
                metadata: {
                    deviceInfo: "Chrome 120.0.0.0",
                    location: "São Paulo, SP",
                    ipAddress: "192.168.1.100"
                }
            },
            {
                id: "3",
                type: "sms",
                category: "backup",
                title: "Backup concluído",
                message: "O backup automático dos dados foi concluído com sucesso",
                status: "delivered",
                priority: "low",
                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
                read: true,
                recipient: "+55 11 99999-9999",
                channel: "SMS",
                metadata: {
                    backupSize: "2.5 GB",
                    duration: "15 minutos"
                }
            },
            {
                id: "4",
                type: "email",
                category: "report",
                title: "Relatório mensal disponível",
                message: "O relatório financeiro do mês de dezembro está disponível para download",
                status: "failed",
                priority: "medium",
                timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
                read: false,
                recipient: "admin@igreja.com",
                channel: "Email",
                errorMessage: "Endereço de email inválido",
                metadata: {
                    reportPeriod: "2024-12",
                    reportType: "monthly"
                }
            },
            {
                id: "5",
                type: "in_app",
                category: "user",
                title: "Novo usuário cadastrado",
                message: "O usuário João Silva foi cadastrado no sistema",
                status: "sent",
                priority: "low",
                timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000),
                read: true,
                recipient: "admin@igreja.com",
                channel: "In-App Notification",
                metadata: {
                    userId: "user_456",
                    userName: "João Silva",
                    role: "Membro"
                }
            }
        ];

        setNotifications(mockNotifications);
        setFilteredNotifications(mockNotifications);
        setIsLoading(false);
    }, []);

    // Filter notifications
    useEffect(() => {
        let filtered = notifications;

        // Type filter
        if (filters.type !== "all") {
            filtered = filtered.filter(notif => notif.type === filters.type);
        }

        // Category filter
        if (filters.category !== "all") {
            filtered = filtered.filter(notif => notif.category === filters.category);
        }

        // Status filter
        if (filters.status !== "all") {
            filtered = filtered.filter(notif => notif.status === filters.status);
        }

        // Priority filter
        if (filters.priority !== "all") {
            filtered = filtered.filter(notif => notif.priority === filters.priority);
        }

        // Read filter
        if (filters.read !== "all") {
            const isRead = filters.read === "read";
            filtered = filtered.filter(notif => notif.read === isRead);
        }

        // Date range filter
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        endDate.setHours(23, 59, 59, 999);

        filtered = filtered.filter(notif => {
            const notifDate = new Date(notif.timestamp);
            return notifDate >= startDate && notifDate <= endDate;
        });

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(notif =>
                notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                notif.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                notif.recipient.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredNotifications(filtered);
    }, [notifications, filters, searchTerm]);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "email":
                return <Mail size={16} />;
            case "push":
                return <Smartphone size={16} />;
            case "sms":
                return <MessageSquare size={16} />;
            case "in_app":
                return <Bell size={16} />;
            default:
                return <Bell size={16} />;
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "transaction":
                return <DollarSign size={16} />;
            case "user":
                return <User size={16} />;
            case "system":
                return <Settings size={16} />;
            case "security":
                return <Shield size={16} />;
            case "report":
                return <Database size={16} />;
            case "backup":
                return <Database size={16} />;
            default:
                return <Bell size={16} />;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "sent":
                return <CheckCircle size={16} color="var(--color-success-600)" />;
            case "delivered":
                return <CheckCircle size={16} color="var(--color-success-600)" />;
            case "failed":
                return <AlertTriangle size={16} color="var(--color-error-600)" />;
            case "pending":
                return <Clock size={16} color="var(--color-warning-600)" />;
            default:
                return <Info size={16} color="var(--color-neutrals-600)" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const baseClasses = styles.statusBadge;
        switch (status) {
            case "sent":
            case "delivered":
                return `${baseClasses} ${styles.success}`;
            case "failed":
                return `${baseClasses} ${styles.failed}`;
            case "pending":
                return `${baseClasses} ${styles.pending}`;
            default:
                return `${baseClasses} ${styles.unknown}`;
        }
    };

    const getPriorityBadge = (priority: string) => {
        const baseClasses = styles.priorityBadge;
        switch (priority) {
            case "urgent":
                return `${baseClasses} ${styles.urgent}`;
            case "high":
                return `${baseClasses} ${styles.high}`;
            case "medium":
                return `${baseClasses} ${styles.medium}`;
            case "low":
                return `${baseClasses} ${styles.low}`;
            default:
                return `${baseClasses} ${styles.low}`;
        }
    };

    const formatTimestamp = (timestamp: Date) => {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(timestamp);
    };

    const handleRefresh = async () => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.showSuccess("Histórico atualizado com sucesso!");
        } catch (error) {
            toast.showApiError("atualizar histórico");
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
        toast.showSuccess("Notificação marcada como lida!");
    };

    const handleMarkAsUnread = (id: string) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: false } : notif
            )
        );
        toast.showSuccess("Notificação marcada como não lida!");
    };

    const handleDeleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
        toast.showSuccess("Notificação excluída!");
    };

    const handleExportHistory = () => {
        const csvContent = [
            ["ID", "Tipo", "Categoria", "Título", "Status", "Prioridade", "Data/Hora", "Destinatário", "Canal"],
            ...filteredNotifications.map(notif => [
                notif.id,
                notif.type,
                notif.category,
                notif.title,
                notif.status,
                notif.priority,
                notif.timestamp.toISOString(),
                notif.recipient,
                notif.channel
            ])
        ].map(row => row.join(",")).join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `notification-history-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);

        toast.showSuccess("Histórico exportado com sucesso!");
    };

    const handleViewNotification = (notification: Notification) => {
        setSelectedNotification(notification);
    };

    const types = ["email", "push", "sms", "in_app"];
    const categories = ["transaction", "user", "system", "security", "report", "backup"];
    const statuses = ["sent", "delivered", "failed", "pending"];
    const priorities = ["low", "medium", "high", "urgent"];

    return (
        <DashboardLayout>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <div className={styles.titleSection}>
                            <div className={styles.iconWrapper}>
                                <Bell size={24} />
                            </div>
                            <div>
                                <h1 className={styles.title}>Histórico de Notificações</h1>
                                <p className={styles.subtitle}>
                                    Visualize e gerencie o histórico de todas as notificações enviadas
                                </p>
                            </div>
                        </div>

                        <div className={styles.headerActions}>
                            <button
                                className={styles.refreshButton}
                                onClick={handleRefresh}
                                disabled={isLoading}
                            >
                                <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                                Atualizar
                            </button>
                            <button
                                className={styles.exportButton}
                                onClick={handleExportHistory}
                            >
                                <Download size={16} />
                                Exportar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className={styles.statsSection}>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <Bell size={20} />
                        </div>
                        <div className={styles.statContent}>
                            <span className={styles.statNumber}>{filteredNotifications.length}</span>
                            <span className={styles.statLabel}>Total</span>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <CheckCircle size={20} />
                        </div>
                        <div className={styles.statContent}>
                            <span className={styles.statNumber}>
                                {filteredNotifications.filter(n => n.status === "delivered").length}
                            </span>
                            <span className={styles.statLabel}>Entregues</span>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <AlertTriangle size={20} />
                        </div>
                        <div className={styles.statContent}>
                            <span className={styles.statNumber}>
                                {filteredNotifications.filter(n => n.status === "failed").length}
                            </span>
                            <span className={styles.statLabel}>Falhas</span>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <EyeOff size={20} />
                        </div>
                        <div className={styles.statContent}>
                            <span className={styles.statNumber}>
                                {filteredNotifications.filter(n => !n.read).length}
                            </span>
                            <span className={styles.statLabel}>Não lidas</span>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className={styles.filtersSection}>
                    <div className={styles.filtersHeader}>
                        <button
                            className={styles.filterToggle}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter size={16} />
                            Filtros
                        </button>

                        <div className={styles.searchBox}>
                            <Search size={16} />
                            <input
                                type="text"
                                placeholder="Buscar notificações..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>
                    </div>

                    {showFilters && (
                        <div className={styles.filtersContent}>
                            <div className={styles.filterRow}>
                                <div className={styles.filterGroup}>
                                    <label className={styles.filterLabel}>Tipo</label>
                                    <select
                                        value={filters.type}
                                        onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                                        className={styles.filterSelect}
                                    >
                                        <option value="all">Todos</option>
                                        {types.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className={styles.filterGroup}>
                                    <label className={styles.filterLabel}>Categoria</label>
                                    <select
                                        value={filters.category}
                                        onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                                        className={styles.filterSelect}
                                    >
                                        <option value="all">Todas</option>
                                        {categories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className={styles.filterGroup}>
                                    <label className={styles.filterLabel}>Status</label>
                                    <select
                                        value={filters.status}
                                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                        className={styles.filterSelect}
                                    >
                                        <option value="all">Todos</option>
                                        {statuses.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className={styles.filterGroup}>
                                    <label className={styles.filterLabel}>Prioridade</label>
                                    <select
                                        value={filters.priority}
                                        onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                                        className={styles.filterSelect}
                                    >
                                        <option value="all">Todas</option>
                                        {priorities.map(priority => (
                                            <option key={priority} value={priority}>{priority}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className={styles.filterRow}>
                                <div className={styles.filterGroup}>
                                    <label className={styles.filterLabel}>Data Inicial</label>
                                    <input
                                        type="date"
                                        value={filters.dateRange.start}
                                        onChange={(e) => setFilters(prev => ({
                                            ...prev,
                                            dateRange: { ...prev.dateRange, start: e.target.value }
                                        }))}
                                        className={styles.filterInput}
                                    />
                                </div>

                                <div className={styles.filterGroup}>
                                    <label className={styles.filterLabel}>Data Final</label>
                                    <input
                                        type="date"
                                        value={filters.dateRange.end}
                                        onChange={(e) => setFilters(prev => ({
                                            ...prev,
                                            dateRange: { ...prev.dateRange, end: e.target.value }
                                        }))}
                                        className={styles.filterInput}
                                    />
                                </div>

                                <div className={styles.filterGroup}>
                                    <label className={styles.filterLabel}>Status de Leitura</label>
                                    <select
                                        value={filters.read}
                                        onChange={(e) => setFilters(prev => ({ ...prev, read: e.target.value }))}
                                        className={styles.filterSelect}
                                    >
                                        <option value="all">Todas</option>
                                        <option value="read">Lidas</option>
                                        <option value="unread">Não lidas</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Notifications List */}
                <div className={styles.notificationsSection}>
                    <div className={styles.tableContainer}>
                        <table className={styles.notificationsTable}>
                            <thead>
                                <tr>
                                    <th>Tipo</th>
                                    <th>Categoria</th>
                                    <th>Título</th>
                                    <th>Status</th>
                                    <th>Prioridade</th>
                                    <th>Data/Hora</th>
                                    <th>Destinatário</th>
                                    <th>Lida</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredNotifications.map((notification) => (
                                    <tr key={notification.id} className={styles.notificationRow}>
                                        <td>
                                            <div className={styles.typeCell}>
                                                {getTypeIcon(notification.type)}
                                                <span>{notification.type}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.categoryCell}>
                                                {getCategoryIcon(notification.category)}
                                                <span>{notification.category}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={styles.titleText}>{notification.title}</span>
                                        </td>
                                        <td>
                                            <div className={getStatusBadge(notification.status)}>
                                                {getStatusIcon(notification.status)}
                                                <span>{notification.status}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={getPriorityBadge(notification.priority)}>
                                                {notification.priority}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={styles.timestamp}>
                                                {formatTimestamp(notification.timestamp)}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={styles.recipient}>{notification.recipient}</span>
                                        </td>
                                        <td>
                                            <span className={notification.read ? styles.readBadge : styles.unreadBadge}>
                                                {notification.read ? "Sim" : "Não"}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={styles.actionButtons}>
                                                <button
                                                    className={styles.viewButton}
                                                    onClick={() => handleViewNotification(notification)}
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                {notification.read ? (
                                                    <button
                                                        className={styles.markUnreadButton}
                                                        onClick={() => handleMarkAsUnread(notification.id)}
                                                    >
                                                        <EyeOff size={16} />
                                                    </button>
                                                ) : (
                                                    <button
                                                        className={styles.markReadButton}
                                                        onClick={() => handleMarkAsRead(notification.id)}
                                                    >
                                                        <CheckCircle size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    className={styles.deleteButton}
                                                    onClick={() => handleDeleteNotification(notification.id)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredNotifications.length === 0 && (
                            <div className={styles.emptyState}>
                                <Bell size={48} />
                                <h3>Nenhuma notificação encontrada</h3>
                                <p>Não há notificações que correspondam aos filtros aplicados.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Notification Detail Modal */}
                {selectedNotification && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <div className={styles.modalHeader}>
                                <h2 className={styles.modalTitle}>Detalhes da Notificação</h2>
                                <button
                                    className={styles.closeButton}
                                    onClick={() => setSelectedNotification(null)}
                                >
                                    ×
                                </button>
                            </div>

                            <div className={styles.modalBody}>
                                <div className={styles.detailSection}>
                                    <h3 className={styles.detailTitle}>Informações Gerais</h3>
                                    <div className={styles.detailGrid}>
                                        <div className={styles.detailItem}>
                                            <span className={styles.detailLabel}>ID:</span>
                                            <span className={styles.detailValue}>{selectedNotification.id}</span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <span className={styles.detailLabel}>Tipo:</span>
                                            <span className={styles.detailValue}>
                                                <div className={styles.typeCell}>
                                                    {getTypeIcon(selectedNotification.type)}
                                                    <span>{selectedNotification.type}</span>
                                                </div>
                                            </span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <span className={styles.detailLabel}>Categoria:</span>
                                            <span className={styles.detailValue}>
                                                <div className={styles.categoryCell}>
                                                    {getCategoryIcon(selectedNotification.category)}
                                                    <span>{selectedNotification.category}</span>
                                                </div>
                                            </span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <span className={styles.detailLabel}>Status:</span>
                                            <span className={styles.detailValue}>
                                                <div className={getStatusBadge(selectedNotification.status)}>
                                                    {getStatusIcon(selectedNotification.status)}
                                                    <span>{selectedNotification.status}</span>
                                                </div>
                                            </span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <span className={styles.detailLabel}>Prioridade:</span>
                                            <span className={styles.detailValue}>
                                                <span className={getPriorityBadge(selectedNotification.priority)}>
                                                    {selectedNotification.priority}
                                                </span>
                                            </span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <span className={styles.detailLabel}>Data/Hora:</span>
                                            <span className={styles.detailValue}>
                                                {formatTimestamp(selectedNotification.timestamp)}
                                            </span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <span className={styles.detailLabel}>Destinatário:</span>
                                            <span className={styles.detailValue}>{selectedNotification.recipient}</span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <span className={styles.detailLabel}>Canal:</span>
                                            <span className={styles.detailValue}>{selectedNotification.channel}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.detailSection}>
                                    <h3 className={styles.detailTitle}>Conteúdo</h3>
                                    <div className={styles.contentCard}>
                                        <h4 className={styles.contentTitle}>{selectedNotification.title}</h4>
                                        <p className={styles.contentMessage}>{selectedNotification.message}</p>
                                    </div>
                                </div>

                                {selectedNotification.errorMessage && (
                                    <div className={styles.detailSection}>
                                        <h3 className={styles.detailTitle}>Mensagem de Erro</h3>
                                        <div className={styles.errorMessage}>
                                            {selectedNotification.errorMessage}
                                        </div>
                                    </div>
                                )}

                                {selectedNotification.metadata && (
                                    <div className={styles.detailSection}>
                                        <h3 className={styles.detailTitle}>Metadados</h3>
                                        <div className={styles.metadataContainer}>
                                            <pre className={styles.metadataCode}>
                                                {JSON.stringify(selectedNotification.metadata, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}