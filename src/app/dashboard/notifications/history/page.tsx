"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../../../../components/layout";
import { useToastNotifications } from "../../../../hooks/useToastNotifications";
import {
    Bell,
    Mail,
    Smartphone,
    Clock,
    Filter,
    Search,
    Download,
    RefreshCw,
    CheckCircle,
    AlertTriangle,
    Info,
    X,
    Calendar,
    Users,
    CreditCard,
    FileText,
    Shield,
    Database,
    Eye,
    EyeOff
} from "lucide-react";
import styles from "./NotificationHistory.module.css";

interface Notification {
    id: string;
    type: "email" | "push" | "sms";
    category: "transactions" | "reports" | "users" | "backups" | "security";
    title: string;
    message: string;
    status: "sent" | "delivered" | "failed" | "read";
    createdAt: Date;
    readAt?: Date;
    priority: "low" | "medium" | "high" | "critical";
    channel: string;
}

export default function NotificationHistoryPage() {
    const toast = useToastNotifications();

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
    const [filters, setFilters] = useState({
        type: "all",
        category: "all",
        status: "all",
        priority: "all",
        dateRange: "all",
        search: ""
    });
    const [isLoading, setIsLoading] = useState(true);
    const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

    // Mock data
    useEffect(() => {
        const mockNotifications: Notification[] = [
            {
                id: "1",
                type: "email",
                category: "transactions",
                title: "Nova transação registrada",
                message: "Uma nova transação de R$ 150,00 foi registrada na conta corrente.",
                status: "delivered",
                createdAt: new Date("2024-01-15T10:30:00"),
                readAt: new Date("2024-01-15T10:35:00"),
                priority: "medium",
                channel: "gustavo@grex.com.br"
            },
            {
                id: "2",
                type: "push",
                category: "security",
                title: "Login suspeito detectado",
                message: "Tentativa de login de um novo dispositivo foi detectada.",
                status: "read",
                createdAt: new Date("2024-01-15T09:15:00"),
                readAt: new Date("2024-01-15T09:20:00"),
                priority: "high",
                channel: "Navegador Chrome"
            },
            {
                id: "3",
                type: "sms",
                category: "backups",
                title: "Backup concluído",
                message: "Backup automático foi concluído com sucesso.",
                status: "delivered",
                createdAt: new Date("2024-01-15T02:00:00"),
                priority: "low",
                channel: "+55 11 99999-9999"
            },
            {
                id: "4",
                type: "email",
                category: "reports",
                title: "Relatório mensal disponível",
                message: "Seu relatório financeiro de janeiro está disponível para download.",
                status: "sent",
                createdAt: new Date("2024-01-14T08:00:00"),
                priority: "medium",
                channel: "gustavo@grex.com.br"
            },
            {
                id: "5",
                type: "push",
                category: "users",
                title: "Novo usuário adicionado",
                message: "Maria Silva foi adicionada como membro da equipe.",
                status: "read",
                createdAt: new Date("2024-01-14T14:30:00"),
                readAt: new Date("2024-01-14T14:35:00"),
                priority: "low",
                channel: "Navegador Chrome"
            },
            {
                id: "6",
                type: "email",
                category: "security",
                title: "Senha alterada",
                message: "Sua senha foi alterada com sucesso.",
                status: "failed",
                createdAt: new Date("2024-01-13T16:45:00"),
                priority: "high",
                channel: "gustavo@grex.com.br"
            }
        ];

        setTimeout(() => {
            setNotifications(mockNotifications);
            setFilteredNotifications(mockNotifications);
            setIsLoading(false);
        }, 1000);
    }, []);

    useEffect(() => {
        let filtered = notifications;

        if (filters.type !== "all") {
            filtered = filtered.filter(n => n.type === filters.type);
        }

        if (filters.category !== "all") {
            filtered = filtered.filter(n => n.category === filters.category);
        }

        if (filters.status !== "all") {
            filtered = filtered.filter(n => n.status === filters.status);
        }

        if (filters.priority !== "all") {
            filtered = filtered.filter(n => n.priority === filters.priority);
        }

        if (filters.search) {
            filtered = filtered.filter(n =>
                n.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                n.message.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        if (filters.dateRange !== "all") {
            const now = new Date();
            const filterDate = new Date();

            switch (filters.dateRange) {
                case "today":
                    filterDate.setHours(0, 0, 0, 0);
                    break;
                case "week":
                    filterDate.setDate(now.getDate() - 7);
                    break;
                case "month":
                    filterDate.setMonth(now.getMonth() - 1);
                    break;
            }

            filtered = filtered.filter(n => n.createdAt >= filterDate);
        }

        setFilteredNotifications(filtered);
    }, [notifications, filters]);

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleRefresh = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
        toast.showSuccess("Histórico atualizado!");
    };

    const handleMarkAsRead = (notificationId: string) => {
        setNotifications(prev =>
            prev.map(n =>
                n.id === notificationId
                    ? { ...n, status: "read" as const, readAt: new Date() }
                    : n
            )
        );
        toast.showSuccess("Notificação marcada como lida!");
    };

    const handleMarkAllAsRead = () => {
        setNotifications(prev =>
            prev.map(n => ({
                ...n,
                status: "read" as const,
                readAt: n.readAt || new Date()
            }))
        );
        toast.showSuccess("Todas as notificações foram marcadas como lidas!");
    };

    const handleSelectNotification = (id: string) => {
        setSelectedNotifications(prev =>
            prev.includes(id)
                ? prev.filter(n => n !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedNotifications.length === filteredNotifications.length) {
            setSelectedNotifications([]);
        } else {
            setSelectedNotifications(filteredNotifications.map(n => n.id));
        }
    };

    const handleExport = () => {
        const dataToExport = filteredNotifications.filter(n => selectedNotifications.includes(n.id));
        toast.showSuccess(`Exportando ${dataToExport.length} notificações...`);
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "email": return Mail;
            case "push": return Bell;
            case "sms": return Smartphone;
            default: return Bell;
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "transactions": return CreditCard;
            case "reports": return FileText;
            case "users": return Users;
            case "backups": return Database;
            case "security": return Shield;
            default: return Bell;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "sent": return "#3b82f6";
            case "delivered": return "#10b981";
            case "read": return "#6b7280";
            case "failed": return "#ef4444";
            default: return "#6b7280";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "low": return "#6b7280";
            case "medium": return "#f59e0b";
            case "high": return "#ef4444";
            case "critical": return "#dc2626";
            default: return "#6b7280";
        }
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const getStats = () => {
        const total = notifications.length;
        const unread = notifications.filter(n => n.status !== "read").length;
        const failed = notifications.filter(n => n.status === "failed").length;
        const today = notifications.filter(n => {
            const today = new Date();
            const notificationDate = new Date(n.createdAt);
            return notificationDate.toDateString() === today.toDateString();
        }).length;

        return { total, unread, failed, today };
    };

    const stats = getStats();

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className={styles.loading}>
                    <RefreshCw size={32} className="animate-spin" />
                    <p>Carregando histórico de notificações...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.titleSection}>
                        <Bell size={32} className={styles.titleIcon} />
                        <div>
                            <h1>Histórico de Notificações</h1>
                            <p>Acompanhe todas as notificações enviadas e recebidas</p>
                        </div>
                    </div>
                    <div className={styles.headerActions}>
                        <button onClick={handleRefresh} className={styles.refreshButton}>
                            <RefreshCw size={16} />
                            Atualizar
                        </button>
                        <button onClick={handleMarkAllAsRead} className={styles.markAllButton}>
                            <CheckCircle size={16} />
                            Marcar todas como lidas
                        </button>
                    </div>
                </div>

                {/* Statistics */}
                <div className={styles.stats}>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ backgroundColor: "#3b82f6" }}>
                            <Bell size={20} />
                        </div>
                        <div>
                            <h3>{stats.total}</h3>
                            <p>Total</p>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ backgroundColor: "#ef4444" }}>
                            <AlertTriangle size={20} />
                        </div>
                        <div>
                            <h3>{stats.unread}</h3>
                            <p>Não lidas</p>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ backgroundColor: "#f59e0b" }}>
                            <X size={20} />
                        </div>
                        <div>
                            <h3>{stats.failed}</h3>
                            <p>Falharam</p>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ backgroundColor: "#10b981" }}>
                            <Calendar size={20} />
                        </div>
                        <div>
                            <h3>{stats.today}</h3>
                            <p>Hoje</p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className={styles.filters}>
                    <div className={styles.searchContainer}>
                        <Search size={16} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Buscar notificações..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange("search", e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>

                    <div className={styles.filterGroup}>
                        <select
                            value={filters.type}
                            onChange={(e) => handleFilterChange("type", e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="all">Todos os tipos</option>
                            <option value="email">Email</option>
                            <option value="push">Push</option>
                            <option value="sms">SMS</option>
                        </select>

                        <select
                            value={filters.category}
                            onChange={(e) => handleFilterChange("category", e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="all">Todas as categorias</option>
                            <option value="transactions">Transações</option>
                            <option value="reports">Relatórios</option>
                            <option value="users">Usuários</option>
                            <option value="backups">Backups</option>
                            <option value="security">Segurança</option>
                        </select>

                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange("status", e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="all">Todos os status</option>
                            <option value="sent">Enviadas</option>
                            <option value="delivered">Entregues</option>
                            <option value="read">Lidas</option>
                            <option value="failed">Falharam</option>
                        </select>

                        <select
                            value={filters.dateRange}
                            onChange={(e) => handleFilterChange("dateRange", e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="all">Todo o período</option>
                            <option value="today">Hoje</option>
                            <option value="week">Última semana</option>
                            <option value="month">Último mês</option>
                        </select>
                    </div>
                </div>

                {/* Actions */}
                {selectedNotifications.length > 0 && (
                    <div className={styles.bulkActions}>
                        <span>{selectedNotifications.length} selecionadas</span>
                        <button onClick={handleExport} className={styles.exportButton}>
                            <Download size={16} />
                            Exportar
                        </button>
                    </div>
                )}

                {/* Notifications List */}
                <div className={styles.notificationsList}>
                    {filteredNotifications.length === 0 ? (
                        <div className={styles.emptyState}>
                            <Bell size={48} />
                            <h3>Nenhuma notificação encontrada</h3>
                            <p>Ajuste os filtros para ver mais notificações</p>
                        </div>
                    ) : (
                        <>
                            <div className={styles.listHeader}>
                                <input
                                    type="checkbox"
                                    checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
                                    onChange={handleSelectAll}
                                    className={styles.checkbox}
                                />
                                <span>Tipo</span>
                                <span>Categoria</span>
                                <span>Mensagem</span>
                                <span>Status</span>
                                <span>Data</span>
                                <span>Ações</span>
                            </div>

                            {filteredNotifications.map(notification => {
                                const TypeIcon = getTypeIcon(notification.type);
                                const CategoryIcon = getCategoryIcon(notification.category);

                                return (
                                    <div key={notification.id} className={styles.notificationItem}>
                                        <input
                                            type="checkbox"
                                            checked={selectedNotifications.includes(notification.id)}
                                            onChange={() => handleSelectNotification(notification.id)}
                                            className={styles.checkbox}
                                        />

                                        <div className={styles.typeColumn}>
                                            <div className={styles.typeIcon}>
                                                <TypeIcon size={16} />
                                            </div>
                                            <span className={styles.typeText}>{notification.type.toUpperCase()}</span>
                                        </div>

                                        <div className={styles.categoryColumn}>
                                            <div className={styles.categoryIcon}>
                                                <CategoryIcon size={16} />
                                            </div>
                                            <span className={styles.categoryText}>{notification.category}</span>
                                        </div>

                                        <div className={styles.messageColumn}>
                                            <h4 className={styles.messageTitle}>{notification.title}</h4>
                                            <p className={styles.messageText}>{notification.message}</p>
                                            <span className={styles.channel}>{notification.channel}</span>
                                        </div>

                                        <div className={styles.statusColumn}>
                                            <span
                                                className={styles.statusBadge}
                                                style={{ backgroundColor: getStatusColor(notification.status) }}
                                            >
                                                {notification.status}
                                            </span>
                                            <span
                                                className={styles.priorityBadge}
                                                style={{ backgroundColor: getPriorityColor(notification.priority) }}
                                            >
                                                {notification.priority}
                                            </span>
                                        </div>

                                        <div className={styles.dateColumn}>
                                            <span className={styles.date}>{formatDate(notification.createdAt)}</span>
                                            {notification.readAt && (
                                                <span className={styles.readDate}>
                                                    Lida: {formatDate(notification.readAt)}
                                                </span>
                                            )}
                                        </div>

                                        <div className={styles.actionsColumn}>
                                            {notification.status !== "read" && (
                                                <button
                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                    className={styles.markReadButton}
                                                    title="Marcar como lida"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}