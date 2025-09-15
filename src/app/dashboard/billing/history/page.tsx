"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "../../../../components/layout";
import billingService from "../../../../services/api/billing.service";
import { Payment, PaginatedResponse } from "../../../../../shared/types";
import {
    CreditCard,
    Calendar,
    Download,
    Search,
    Filter,
    ChevronDown,
    Loader2,
    AlertCircle,
    CheckCircle,
    XCircle,
    Clock,
    RefreshCw,
    Eye,
    ArrowLeft,
    ArrowRight
} from "lucide-react";
import styles from "./History.module.css";

export default function PaymentHistoryPage() {
    const router = useRouter();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
    });
    const [filters, setFilters] = useState({
        status: '',
        dateFrom: '',
        dateTo: '',
        search: ''
    });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        loadPayments();
    }, [pagination.page, filters]);

    const loadPayments = async () => {
        try {
            setLoading(true);
            setError(null);

            // Mock data for now - replace with actual API call when backend is ready
            const mockPayments: Payment[] = [
                {
                    id: '1',
                    userId: 'user1',
                    subscriptionId: 'sub1',
                    amount: 80.00,
                    currency: 'BRL',
                    status: 'succeeded',
                    paymentMethodId: 'pm1',
                    paymentMethod: {
                        id: 'pm1',
                        userId: 'user1',
                        type: 'card',
                        provider: 'stripe',
                        last4: '4523',
                        brand: 'visa',
                        expiryMonth: 12,
                        expiryYear: 2025,
                        isDefault: true,
                        createdAt: new Date()
                    },
                    description: 'Assinatura mensal - Plano Start',
                    paidAt: new Date(),
                    createdAt: new Date()
                },
                {
                    id: '2',
                    userId: 'user1',
                    subscriptionId: 'sub1',
                    amount: 80.00,
                    currency: 'BRL',
                    status: 'succeeded',
                    paymentMethodId: 'pm1',
                    paymentMethod: {
                        id: 'pm1',
                        userId: 'user1',
                        type: 'card',
                        provider: 'stripe',
                        last4: '4523',
                        brand: 'visa',
                        expiryMonth: 12,
                        expiryYear: 2025,
                        isDefault: true,
                        createdAt: new Date()
                    },
                    description: 'Assinatura mensal - Plano Start',
                    paidAt: new Date('2024-08-03'),
                    createdAt: new Date('2024-08-03')
                }
            ];

            const mockPagination = {
                page: 1,
                limit: 10,
                total: 2,
                totalPages: 1,
                hasNext: false,
                hasPrev: false
            };

            setPayments(mockPayments);
            setPagination(mockPagination);

            // TODO: Replace with actual API call when backend is ready
            // const response: PaginatedResponse<Payment> = await billingService.getPayments({
            //   page: pagination.page,
            //   limit: pagination.limit,
            //   filter: {
            //     status: filters.status || undefined,
            //     dateFrom: filters.dateFrom || undefined,
            //     dateTo: filters.dateTo || undefined,
            //     search: filters.search || undefined
            //   }
            // });
        } catch (err) {
            setError('Erro ao carregar histórico de pagamentos');
            console.error('Error loading payments:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
        setPagination(prev => ({
            ...prev,
            page: 1
        }));
    };

    const clearFilters = () => {
        setFilters({
            status: '',
            dateFrom: '',
            dateTo: '',
            search: ''
        });
        setPagination(prev => ({
            ...prev,
            page: 1
        }));
    };

    const handlePageChange = (newPage: number) => {
        setPagination(prev => ({
            ...prev,
            page: newPage
        }));
    };

    const formatPrice = (amount: number, currency: string) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: currency.toUpperCase()
        }).format(amount);
    };

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'succeeded':
                return <CheckCircle className={styles.statusIconSuccess} />;
            case 'pending':
                return <Clock className={styles.statusIconPending} />;
            case 'failed':
                return <XCircle className={styles.statusIconFailed} />;
            case 'cancelled':
                return <XCircle className={styles.statusIconCancelled} />;
            case 'refunded':
                return <RefreshCw className={styles.statusIconRefunded} />;
            default:
                return <Clock className={styles.statusIconPending} />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'succeeded': return 'Pago';
            case 'pending': return 'Pendente';
            case 'failed': return 'Falhou';
            case 'cancelled': return 'Cancelado';
            case 'refunded': return 'Reembolsado';
            default: return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'succeeded': return styles.statusSuccess;
            case 'pending': return styles.statusPending;
            case 'failed': return styles.statusFailed;
            case 'cancelled': return styles.statusCancelled;
            case 'refunded': return styles.statusRefunded;
            default: return styles.statusPending;
        }
    };

    const handleDownloadInvoice = async (paymentId: string) => {
        try {
            const blob = await billingService.downloadInvoice(paymentId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `fatura-${paymentId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error('Error downloading invoice:', err);
        }
    };

    const handleViewPayment = (paymentId: string) => {
        router.push(`/dashboard/billing/payments/${paymentId}`);
    };

    if (loading && payments.length === 0) {
        return (
            <DashboardLayout>
                <div className={styles.loadingContainer}>
                    <Loader2 className={styles.spinner} />
                    <p>Carregando histórico de pagamentos...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Histórico de pagamentos</h1>
                    <p>Acompanhe todos os seus pagamentos e faturas</p>
                </div>

                <div className={styles.controls}>
                    <div className={styles.searchBar}>
                        <Search className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Buscar por descrição, valor ou ID..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                        />
                    </div>

                    <div className={styles.filterControls}>
                        <button
                            className={styles.filterButton}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter className={styles.filterIcon} />
                            Filtros
                            <ChevronDown className={`${styles.chevronIcon} ${showFilters ? styles.rotated : ''}`} />
                        </button>

                        <button
                            className={styles.refreshButton}
                            onClick={loadPayments}
                            disabled={loading}
                        >
                            <RefreshCw className={`${styles.refreshIcon} ${loading ? styles.spinning : ''}`} />
                        </button>
                    </div>
                </div>

                {showFilters && (
                    <div className={styles.filtersPanel}>
                        <div className={styles.filterRow}>
                            <div className={styles.filterGroup}>
                                <label>Status</label>
                                <select
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                >
                                    <option value="">Todos os status</option>
                                    <option value="succeeded">Pago</option>
                                    <option value="pending">Pendente</option>
                                    <option value="failed">Falhou</option>
                                    <option value="cancelled">Cancelado</option>
                                    <option value="refunded">Reembolsado</option>
                                </select>
                            </div>

                            <div className={styles.filterGroup}>
                                <label>Data inicial</label>
                                <input
                                    type="date"
                                    value={filters.dateFrom}
                                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                                />
                            </div>

                            <div className={styles.filterGroup}>
                                <label>Data final</label>
                                <input
                                    type="date"
                                    value={filters.dateTo}
                                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                                />
                            </div>

                            <button
                                className={styles.clearFiltersButton}
                                onClick={clearFilters}
                            >
                                Limpar filtros
                            </button>
                        </div>
                    </div>
                )}

                {error && (
                    <div className={styles.errorAlert}>
                        <AlertCircle className={styles.errorIcon} />
                        <span>{error}</span>
                    </div>
                )}

                <div className={styles.paymentsTable}>
                    <div className={styles.tableHeader}>
                        <div className={styles.headerCell}>Data</div>
                        <div className={styles.headerCell}>Descrição</div>
                        <div className={styles.headerCell}>Valor</div>
                        <div className={styles.headerCell}>Status</div>
                        <div className={styles.headerCell}>Método</div>
                        <div className={styles.headerCell}>Ações</div>
                    </div>

                    {payments.length === 0 ? (
                        <div className={styles.emptyState}>
                            <CreditCard className={styles.emptyIcon} />
                            <h3>Nenhum pagamento encontrado</h3>
                            <p>Não há pagamentos que correspondam aos filtros aplicados.</p>
                        </div>
                    ) : (
                        payments.map((payment) => (
                            <div key={payment.id} className={styles.paymentRow}>
                                <div className={styles.dateCell}>
                                    <Calendar className={styles.dateIcon} />
                                    <span>{formatDate(payment.createdAt)}</span>
                                </div>

                                <div className={styles.descriptionCell}>
                                    <span className={styles.description}>{payment.description}</span>
                                    <span className={styles.paymentId}>ID: {payment.id.slice(0, 8)}...</span>
                                </div>

                                <div className={styles.amountCell}>
                                    <span className={styles.amount}>
                                        {formatPrice(payment.amount, payment.currency)}
                                    </span>
                                </div>

                                <div className={styles.statusCell}>
                                    <div className={`${styles.statusBadge} ${getStatusColor(payment.status)}`}>
                                        {getStatusIcon(payment.status)}
                                        <span>{getStatusText(payment.status)}</span>
                                    </div>
                                </div>

                                <div className={styles.methodCell}>
                                    <CreditCard className={styles.methodIcon} />
                                    <div>
                                        <span className={styles.methodType}>
                                            {payment.paymentMethod.brand?.toUpperCase() || 'Cartão'}
                                        </span>
                                        <span className={styles.methodLast4}>
                                            •••• {payment.paymentMethod.last4}
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.actionsCell}>
                                    <button
                                        className={styles.actionButton}
                                        onClick={() => handleViewPayment(payment.id)}
                                        title="Ver detalhes"
                                    >
                                        <Eye className={styles.actionIcon} />
                                    </button>
                                    <button
                                        className={styles.actionButton}
                                        onClick={() => handleDownloadInvoice(payment.id)}
                                        title="Baixar fatura"
                                    >
                                        <Download className={styles.actionIcon} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {pagination.totalPages > 1 && (
                    <div className={styles.pagination}>
                        <button
                            className={styles.paginationButton}
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={!pagination.hasPrev}
                        >
                            <ArrowLeft className={styles.paginationIcon} />
                            Anterior
                        </button>

                        <div className={styles.paginationInfo}>
                            Página {pagination.page} de {pagination.totalPages}
                        </div>

                        <button
                            className={styles.paginationButton}
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={!pagination.hasNext}
                        >
                            Próxima
                            <ArrowRight className={styles.paginationIcon} />
                        </button>
                    </div>
                )}

                <div className={styles.summary}>
                    <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>Total de pagamentos:</span>
                        <span className={styles.summaryValue}>{pagination.total}</span>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
