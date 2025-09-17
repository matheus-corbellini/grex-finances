"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../../../../components/layout";
import { useToastNotifications } from "../../../../hooks/useToastNotifications";
import {
    Activity,
    Filter,
    Search,
    RefreshCw,
    Download,
    Eye,
    AlertTriangle,
    CheckCircle,
    Clock,
    XCircle,
    Calendar,
    Globe,
    Zap,
    Code,
    Copy,
    ExternalLink
} from "lucide-react";
import styles from "./WebhookLogs.module.css";

interface WebhookLog {
    id: string;
    webhookName: string;
    url: string;
    event: string;
    status: "success" | "failed" | "pending";
    statusCode?: number;
    responseTime: number;
    timestamp: Date;
    requestPayload: any;
    responsePayload?: any;
    errorMessage?: string;
    retryCount: number;
    headers: Record<string, string>;
}

interface FilterOptions {
    status: string;
    event: string;
    dateRange: {
        start: string;
        end: string;
    };
    webhook: string;
}

export default function WebhookLogsPage() {
    const toast = useToastNotifications();
    const [logs, setLogs] = useState<WebhookLog[]>([]);
    const [filteredLogs, setFilteredLogs] = useState<WebhookLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedLog, setSelectedLog] = useState<WebhookLog | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const [filters, setFilters] = useState<FilterOptions>({
        status: "all",
        event: "all",
        dateRange: {
            start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            end: new Date().toISOString().split('T')[0]
        },
        webhook: "all"
    });

    // Mock data
    useEffect(() => {
        const mockLogs: WebhookLog[] = [
            {
                id: "1",
                webhookName: "Payment Success",
                url: "https://api.igreja.com/webhooks/payment-success",
                event: "payment.completed",
                status: "success",
                statusCode: 200,
                responseTime: 245,
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                requestPayload: { paymentId: "pay_123", amount: 100.00, currency: "BRL" },
                responsePayload: { received: true, processed: true },
                retryCount: 0,
                headers: { "Content-Type": "application/json", "User-Agent": "Grex-Webhook/1.0" }
            },
            {
                id: "2",
                webhookName: "User Registration",
                url: "https://api.igreja.com/webhooks/user-registration",
                event: "user.created",
                status: "failed",
                statusCode: 500,
                responseTime: 1200,
                timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
                requestPayload: { userId: "user_456", email: "user@example.com" },
                errorMessage: "Internal server error",
                retryCount: 2,
                headers: { "Content-Type": "application/json" }
            },
            {
                id: "3",
                webhookName: "Transaction Update",
                url: "https://api.igreja.com/webhooks/transaction-update",
                event: "transaction.updated",
                status: "pending",
                responseTime: 0,
                timestamp: new Date(Date.now() - 30 * 60 * 1000),
                requestPayload: { transactionId: "txn_789", status: "completed" },
                retryCount: 0,
                headers: { "Content-Type": "application/json" }
            }
        ];

        setLogs(mockLogs);
        setFilteredLogs(mockLogs);
        setIsLoading(false);
    }, []);

    // Filter logs
    useEffect(() => {
        let filtered = logs;

        // Status filter
        if (filters.status !== "all") {
            filtered = filtered.filter(log => log.status === filters.status);
        }

        // Event filter
        if (filters.event !== "all") {
            filtered = filtered.filter(log => log.event === filters.event);
        }

        // Webhook filter
        if (filters.webhook !== "all") {
            filtered = filtered.filter(log => log.webhookName === filters.webhook);
        }

        // Date range filter
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        endDate.setHours(23, 59, 59, 999);

        filtered = filtered.filter(log => {
            const logDate = new Date(log.timestamp);
            return logDate >= startDate && logDate <= endDate;
        });

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(log =>
                log.webhookName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.event.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredLogs(filtered);
    }, [logs, filters, searchTerm]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "success":
                return <CheckCircle size={16} color="var(--color-success-600)" />;
            case "failed":
                return <XCircle size={16} color="var(--color-error-600)" />;
            case "pending":
                return <Clock size={16} color="var(--color-warning-600)" />;
            default:
                return <AlertTriangle size={16} color="var(--color-neutrals-600)" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const baseClasses = styles.statusBadge;
        switch (status) {
            case "success":
                return `${baseClasses} ${styles.success}`;
            case "failed":
                return `${baseClasses} ${styles.failed}`;
            case "pending":
                return `${baseClasses} ${styles.pending}`;
            default:
                return `${baseClasses} ${styles.unknown}`;
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

    const formatResponseTime = (time: number) => {
        return `${time}ms`;
    };

    const handleRefresh = async () => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.showSuccess("Logs atualizados com sucesso!");
        } catch (error) {
            toast.showApiError("atualizar logs");
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportLogs = () => {
        const csvContent = [
            ["ID", "Webhook", "URL", "Event", "Status", "Status Code", "Response Time", "Timestamp", "Retry Count"],
            ...filteredLogs.map(log => [
                log.id,
                log.webhookName,
                log.url,
                log.event,
                log.status,
                log.statusCode || "",
                log.responseTime,
                log.timestamp.toISOString(),
                log.retryCount
            ])
        ].map(row => row.join(",")).join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `webhook-logs-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);

        toast.showSuccess("Logs exportados com sucesso!");
    };

    const handleViewLog = (log: WebhookLog) => {
        setSelectedLog(log);
    };

    const handleCopyPayload = (payload: any) => {
        navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
        toast.showSuccess("Payload copiado para a área de transferência!");
    };

    const uniqueWebhooks = Array.from(new Set(logs.map(log => log.webhookName)));
    const uniqueEvents = Array.from(new Set(logs.map(log => log.event)));

    return (
        <DashboardLayout>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <div className={styles.titleSection}>
                            <div className={styles.iconWrapper}>
                                <Activity size={24} />
                            </div>
                            <div>
                                <h1 className={styles.title}>Logs de Webhook</h1>
                                <p className={styles.subtitle}>
                                    Monitore e analise os logs de execução dos webhooks
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
                                onClick={handleExportLogs}
                            >
                                <Download size={16} />
                                Exportar
                            </button>
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
                                placeholder="Buscar por webhook, URL ou evento..."
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
                                    <label className={styles.filterLabel}>Status</label>
                                    <select
                                        value={filters.status}
                                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                        className={styles.filterSelect}
                                    >
                                        <option value="all">Todos</option>
                                        <option value="success">Sucesso</option>
                                        <option value="failed">Falha</option>
                                        <option value="pending">Pendente</option>
                                    </select>
                                </div>

                                <div className={styles.filterGroup}>
                                    <label className={styles.filterLabel}>Evento</label>
                                    <select
                                        value={filters.event}
                                        onChange={(e) => setFilters(prev => ({ ...prev, event: e.target.value }))}
                                        className={styles.filterSelect}
                                    >
                                        <option value="all">Todos</option>
                                        {uniqueEvents.map(event => (
                                            <option key={event} value={event}>{event}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className={styles.filterGroup}>
                                    <label className={styles.filterLabel}>Webhook</label>
                                    <select
                                        value={filters.webhook}
                                        onChange={(e) => setFilters(prev => ({ ...prev, webhook: e.target.value }))}
                                        className={styles.filterSelect}
                                    >
                                        <option value="all">Todos</option>
                                        {uniqueWebhooks.map(webhook => (
                                            <option key={webhook} value={webhook}>{webhook}</option>
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
                            </div>
                        </div>
                    )}
                </div>

                {/* Stats */}
                <div className={styles.statsSection}>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <CheckCircle size={20} />
                        </div>
                        <div className={styles.statContent}>
                            <span className={styles.statNumber}>
                                {filteredLogs.filter(log => log.status === "success").length}
                            </span>
                            <span className={styles.statLabel}>Sucessos</span>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <XCircle size={20} />
                        </div>
                        <div className={styles.statContent}>
                            <span className={styles.statNumber}>
                                {filteredLogs.filter(log => log.status === "failed").length}
                            </span>
                            <span className={styles.statLabel}>Falhas</span>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <Clock size={20} />
                        </div>
                        <div className={styles.statContent}>
                            <span className={styles.statNumber}>
                                {filteredLogs.filter(log => log.status === "pending").length}
                            </span>
                            <span className={styles.statLabel}>Pendentes</span>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <Zap size={20} />
                        </div>
                        <div className={styles.statContent}>
                            <span className={styles.statNumber}>
                                {filteredLogs.length > 0
                                    ? Math.round(filteredLogs.reduce((acc, log) => acc + log.responseTime, 0) / filteredLogs.length)
                                    : 0
                                }ms
                            </span>
                            <span className={styles.statLabel}>Tempo Médio</span>
                        </div>
                    </div>
                </div>

                {/* Logs Table */}
                <div className={styles.logsSection}>
                    <div className={styles.tableContainer}>
                        <table className={styles.logsTable}>
                            <thead>
                                <tr>
                                    <th>Status</th>
                                    <th>Webhook</th>
                                    <th>Evento</th>
                                    <th>URL</th>
                                    <th>Status Code</th>
                                    <th>Tempo</th>
                                    <th>Data/Hora</th>
                                    <th>Tentativas</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.map((log) => (
                                    <tr key={log.id} className={styles.logRow}>
                                        <td>
                                            <div className={getStatusBadge(log.status)}>
                                                {getStatusIcon(log.status)}
                                                <span>{log.status}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={styles.webhookName}>{log.webhookName}</span>
                                        </td>
                                        <td>
                                            <span className={styles.eventName}>{log.event}</span>
                                        </td>
                                        <td>
                                            <div className={styles.urlCell}>
                                                <Globe size={14} />
                                                <span className={styles.urlText}>{log.url}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={styles.statusCode}>
                                                {log.statusCode || "-"}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={styles.responseTime}>
                                                {formatResponseTime(log.responseTime)}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={styles.timestamp}>
                                                {formatTimestamp(log.timestamp)}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={styles.retryCount}>
                                                {log.retryCount}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className={styles.viewButton}
                                                onClick={() => handleViewLog(log)}
                                            >
                                                <Eye size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredLogs.length === 0 && (
                            <div className={styles.emptyState}>
                                <Activity size={48} />
                                <h3>Nenhum log encontrado</h3>
                                <p>Não há logs que correspondam aos filtros aplicados.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Log Detail Modal */}
                {selectedLog && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <div className={styles.modalHeader}>
                                <h2 className={styles.modalTitle}>Detalhes do Log</h2>
                                <button
                                    className={styles.closeButton}
                                    onClick={() => setSelectedLog(null)}
                                >
                                    <XCircle size={20} />
                                </button>
                            </div>

                            <div className={styles.modalBody}>
                                <div className={styles.detailSection}>
                                    <h3 className={styles.detailTitle}>Informações Gerais</h3>
                                    <div className={styles.detailGrid}>
                                        <div className={styles.detailItem}>
                                            <span className={styles.detailLabel}>ID:</span>
                                            <span className={styles.detailValue}>{selectedLog.id}</span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <span className={styles.detailLabel}>Webhook:</span>
                                            <span className={styles.detailValue}>{selectedLog.webhookName}</span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <span className={styles.detailLabel}>Evento:</span>
                                            <span className={styles.detailValue}>{selectedLog.event}</span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <span className={styles.detailLabel}>Status:</span>
                                            <span className={styles.detailValue}>
                                                <div className={getStatusBadge(selectedLog.status)}>
                                                    {getStatusIcon(selectedLog.status)}
                                                    <span>{selectedLog.status}</span>
                                                </div>
                                            </span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <span className={styles.detailLabel}>URL:</span>
                                            <span className={styles.detailValue}>
                                                <a href={selectedLog.url} target="_blank" rel="noopener noreferrer">
                                                    {selectedLog.url}
                                                    <ExternalLink size={14} />
                                                </a>
                                            </span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <span className={styles.detailLabel}>Data/Hora:</span>
                                            <span className={styles.detailValue}>
                                                {formatTimestamp(selectedLog.timestamp)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.detailSection}>
                                    <h3 className={styles.detailTitle}>Request Payload</h3>
                                    <div className={styles.payloadContainer}>
                                        <button
                                            className={styles.copyButton}
                                            onClick={() => handleCopyPayload(selectedLog.requestPayload)}
                                        >
                                            <Copy size={16} />
                                            Copiar
                                        </button>
                                        <pre className={styles.payloadCode}>
                                            {JSON.stringify(selectedLog.requestPayload, null, 2)}
                                        </pre>
                                    </div>
                                </div>

                                {selectedLog.responsePayload && (
                                    <div className={styles.detailSection}>
                                        <h3 className={styles.detailTitle}>Response Payload</h3>
                                        <div className={styles.payloadContainer}>
                                            <button
                                                className={styles.copyButton}
                                                onClick={() => handleCopyPayload(selectedLog.responsePayload)}
                                            >
                                                <Copy size={16} />
                                                Copiar
                                            </button>
                                            <pre className={styles.payloadCode}>
                                                {JSON.stringify(selectedLog.responsePayload, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                )}

                                {selectedLog.errorMessage && (
                                    <div className={styles.detailSection}>
                                        <h3 className={styles.detailTitle}>Mensagem de Erro</h3>
                                        <div className={styles.errorMessage}>
                                            {selectedLog.errorMessage}
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
