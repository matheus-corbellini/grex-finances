"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "../../../../components/layout";
import billingService from "../../../../services/api/billing.service";
import { Invoice, PaginatedResponse, BillingSummary } from "../../../../../shared/types";
import {
    FileText,
    Download,
    Search,
    Filter,
    ChevronDown,
    Loader2,
    AlertCircle,
    CheckCircle,
    Clock,
    XCircle,
    Calendar,
    CreditCard,
    Mail,
    MapPin,
    RefreshCw,
    Eye,
    ArrowLeft,
    ArrowRight,
    DollarSign
} from "lucide-react";
import styles from "./Invoices.module.css";

export default function InvoicesPage() {
    const router = useRouter();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [billingSummary, setBillingSummary] = useState<BillingSummary | null>(null);
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
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    useEffect(() => {
        loadData();
    }, [pagination.page, filters]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Mock data for now - replace with actual API calls when backend is ready
            const mockInvoices: Invoice[] = [
                {
                    id: 'inv1',
                    userId: 'user1',
                    subscriptionId: 'sub1',
                    number: 'INV-2024-001',
                    amount: 80.00,
                    currency: 'BRL',
                    status: 'paid',
                    dueDate: new Date('2024-08-03'),
                    paidAt: new Date('2024-08-03'),
                    periodStart: new Date('2024-08-03'),
                    periodEnd: new Date('2024-09-02'),
                    items: [
                        {
                            id: 'item1',
                            description: 'Assinatura mensal - Plano Start',
                            quantity: 1,
                            unitPrice: 80.00,
                            amount: 80.00
                        }
                    ],
                    subtotal: 80.00,
                    tax: 0.00,
                    total: 80.00,
                    createdAt: new Date('2024-08-03')
                },
                {
                    id: 'inv2',
                    userId: 'user1',
                    subscriptionId: 'sub1',
                    number: 'INV-2024-002',
                    amount: 80.00,
                    currency: 'BRL',
                    status: 'paid',
                    dueDate: new Date('2024-07-03'),
                    paidAt: new Date('2024-07-03'),
                    periodStart: new Date('2024-07-03'),
                    periodEnd: new Date('2024-08-02'),
                    items: [
                        {
                            id: 'item2',
                            description: 'Assinatura mensal - Plano Start',
                            quantity: 1,
                            unitPrice: 80.00,
                            amount: 80.00
                        }
                    ],
                    subtotal: 80.00,
                    tax: 0.00,
                    total: 80.00,
                    createdAt: new Date('2024-07-03')
                }
            ];

            const mockBillingSummary: BillingSummary = {
                currentPlan: {
                    id: 'start',
                    name: 'Plano Start',
                    description: 'Ideal para igrejas pequenas',
                    price: 80,
                    currency: 'BRL',
                    billingCycle: 'monthly',
                    features: ['Até 5 usuários', 'Até 10 contas', 'Relatórios básicos'],
                    maxUsers: 5,
                    maxAccounts: 10,
                    includesReports: true,
                    includesSupport: 'basic'
                },
                nextBillingDate: new Date('2024-09-03'),
                nextBillingAmount: 80.00,
                currency: 'BRL',
                usage: {
                    users: { current: 3, limit: 5, percentage: 60 },
                    accounts: { current: 7, limit: 10, percentage: 70 },
                    transactions: { current: 150, limit: 1000, percentage: 15 },
                    storage: { current: 50, limit: 1000, percentage: 5 }
                },
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
                billingEmail: 'gustavo@grex.com.br'
            };

            setInvoices(mockInvoices);
            setPagination({
                page: 1,
                limit: 10,
                total: 2,
                totalPages: 1,
                hasNext: false,
                hasPrev: false
            });
            setBillingSummary(mockBillingSummary);

            // TODO: Replace with actual API calls when backend is ready
            // const [invoicesResponse, summaryResponse] = await Promise.all([
            //   billingService.getInvoices({...}),
            //   billingService.getBillingSummary().catch(() => null)
            // ]);
        } catch (err) {
            setError('Erro ao carregar faturas');
            console.error('Error loading invoices:', err);
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
            year: 'numeric'
        });
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'paid':
                return <CheckCircle className={styles.statusIconPaid} />;
            case 'open':
                return <Clock className={styles.statusIconOpen} />;
            case 'void':
                return <XCircle className={styles.statusIconVoid} />;
            case 'uncollectible':
                return <XCircle className={styles.statusIconUncollectible} />;
            default:
                return <Clock className={styles.statusIconOpen} />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'paid': return 'Pago';
            case 'open': return 'Em aberto';
            case 'void': return 'Cancelada';
            case 'uncollectible': return 'Não cobrável';
            case 'draft': return 'Rascunho';
            default: return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return styles.statusPaid;
            case 'open': return styles.statusOpen;
            case 'void': return styles.statusVoid;
            case 'uncollectible': return styles.statusUncollectible;
            case 'draft': return styles.statusDraft;
            default: return styles.statusOpen;
        }
    };

    const handleDownloadInvoice = async (invoiceId: string) => {
        try {
            const blob = await billingService.downloadInvoice(invoiceId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `fatura-${invoiceId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error('Error downloading invoice:', err);
        }
    };

    const handleViewInvoice = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
    };

    if (loading && invoices.length === 0) {
        return (
            <DashboardLayout>
                <div className={styles.loadingContainer}>
                    <Loader2 className={styles.spinner} />
                    <p>Carregando faturas...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Faturas e cobranças</h1>
                    <p>Visualize e gerencie suas faturas e informações de cobrança</p>
                </div>

                {billingSummary && (
                    <div className={styles.summaryCards}>
                        <div className={styles.summaryCard}>
                            <div className={styles.summaryIcon}>
                                <CreditCard className={styles.icon} />
                            </div>
                            <div className={styles.summaryContent}>
                                <h3>Plano atual</h3>
                                <p className={styles.summaryValue}>{billingSummary.currentPlan.name}</p>
                                <p className={styles.summarySubtext}>
                                    {formatPrice(billingSummary.nextBillingAmount, billingSummary.currency)} / mês
                                </p>
                            </div>
                        </div>

                        <div className={styles.summaryCard}>
                            <div className={styles.summaryIcon}>
                                <Calendar className={styles.icon} />
                            </div>
                            <div className={styles.summaryContent}>
                                <h3>Próxima cobrança</h3>
                                <p className={styles.summaryValue}>
                                    {formatDate(billingSummary.nextBillingDate)}
                                </p>
                                <p className={styles.summarySubtext}>
                                    {formatPrice(billingSummary.nextBillingAmount, billingSummary.currency)}
                                </p>
                            </div>
                        </div>

                        <div className={styles.summaryCard}>
                            <div className={styles.summaryIcon}>
                                <Mail className={styles.icon} />
                            </div>
                            <div className={styles.summaryContent}>
                                <h3>E-mail de cobrança</h3>
                                <p className={styles.summaryValue}>{billingSummary.billingEmail}</p>
                                <p className={styles.summarySubtext}>Atualizar</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className={styles.controls}>
                    <div className={styles.searchBar}>
                        <Search className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Buscar por número, valor ou período..."
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
                            onClick={loadData}
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
                                    <option value="paid">Pago</option>
                                    <option value="open">Em aberto</option>
                                    <option value="void">Cancelada</option>
                                    <option value="uncollectible">Não cobrável</option>
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

                <div className={styles.invoicesTable}>
                    <div className={styles.tableHeader}>
                        <div className={styles.headerCell}>Número</div>
                        <div className={styles.headerCell}>Data</div>
                        <div className={styles.headerCell}>Período</div>
                        <div className={styles.headerCell}>Valor</div>
                        <div className={styles.headerCell}>Status</div>
                        <div className={styles.headerCell}>Vencimento</div>
                        <div className={styles.headerCell}>Ações</div>
                    </div>

                    {invoices.length === 0 ? (
                        <div className={styles.emptyState}>
                            <FileText className={styles.emptyIcon} />
                            <h3>Nenhuma fatura encontrada</h3>
                            <p>Não há faturas que correspondam aos filtros aplicados.</p>
                        </div>
                    ) : (
                        invoices.map((invoice) => (
                            <div key={invoice.id} className={styles.invoiceRow}>
                                <div className={styles.numberCell}>
                                    <span className={styles.invoiceNumber}>#{invoice.number}</span>
                                </div>

                                <div className={styles.dateCell}>
                                    <Calendar className={styles.dateIcon} />
                                    <span>{formatDate(invoice.createdAt)}</span>
                                </div>

                                <div className={styles.periodCell}>
                                    <span className={styles.period}>
                                        {formatDate(invoice.periodStart)} - {formatDate(invoice.periodEnd)}
                                    </span>
                                </div>

                                <div className={styles.amountCell}>
                                    <span className={styles.amount}>
                                        {formatPrice(invoice.total, invoice.currency)}
                                    </span>
                                </div>

                                <div className={styles.statusCell}>
                                    <div className={`${styles.statusBadge} ${getStatusColor(invoice.status)}`}>
                                        {getStatusIcon(invoice.status)}
                                        <span>{getStatusText(invoice.status)}</span>
                                    </div>
                                </div>

                                <div className={styles.dueDateCell}>
                                    <span className={styles.dueDate}>
                                        {formatDate(invoice.dueDate)}
                                    </span>
                                </div>

                                <div className={styles.actionsCell}>
                                    <button
                                        className={styles.actionButton}
                                        onClick={() => handleViewInvoice(invoice)}
                                        title="Ver detalhes"
                                    >
                                        <Eye className={styles.actionIcon} />
                                    </button>
                                    <button
                                        className={styles.actionButton}
                                        onClick={() => handleDownloadInvoice(invoice.id)}
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
                        <span className={styles.summaryLabel}>Total de faturas:</span>
                        <span className={styles.summaryValue}>{pagination.total}</span>
                    </div>
                </div>

                {/* Invoice Details Modal */}
                {selectedInvoice && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <div className={styles.modalHeader}>
                                <h3>Fatura #{selectedInvoice.number}</h3>
                                <button
                                    className={styles.closeModalButton}
                                    onClick={() => setSelectedInvoice(null)}
                                >
                                    <XCircle className={styles.closeIcon} />
                                </button>
                            </div>
                            <div className={styles.modalContent}>
                                <div className={styles.invoiceDetails}>
                                    <div className={styles.detailRow}>
                                        <span className={styles.detailLabel}>Status:</span>
                                        <div className={`${styles.statusBadge} ${getStatusColor(selectedInvoice.status)}`}>
                                            {getStatusIcon(selectedInvoice.status)}
                                            <span>{getStatusText(selectedInvoice.status)}</span>
                                        </div>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span className={styles.detailLabel}>Data de emissão:</span>
                                        <span>{formatDate(selectedInvoice.createdAt)}</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span className={styles.detailLabel}>Vencimento:</span>
                                        <span>{formatDate(selectedInvoice.dueDate)}</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span className={styles.detailLabel}>Período:</span>
                                        <span>
                                            {formatDate(selectedInvoice.periodStart)} - {formatDate(selectedInvoice.periodEnd)}
                                        </span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span className={styles.detailLabel}>Subtotal:</span>
                                        <span>{formatPrice(selectedInvoice.subtotal, selectedInvoice.currency)}</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span className={styles.detailLabel}>Taxa:</span>
                                        <span>{formatPrice(selectedInvoice.tax, selectedInvoice.currency)}</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span className={styles.detailLabel}>Total:</span>
                                        <span className={styles.totalAmount}>
                                            {formatPrice(selectedInvoice.total, selectedInvoice.currency)}
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.invoiceItems}>
                                    <h4>Itens da fatura</h4>
                                    {selectedInvoice.items.map((item, index) => (
                                        <div key={index} className={styles.invoiceItem}>
                                            <div className={styles.itemDescription}>
                                                {item.description}
                                            </div>
                                            <div className={styles.itemQuantity}>
                                                {item.quantity}x
                                            </div>
                                            <div className={styles.itemPrice}>
                                                {formatPrice(item.unitPrice, selectedInvoice.currency)}
                                            </div>
                                            <div className={styles.itemTotal}>
                                                {formatPrice(item.amount, selectedInvoice.currency)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.modalActions}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => setSelectedInvoice(null)}
                                >
                                    Fechar
                                </button>
                                <button
                                    className={styles.downloadButton}
                                    onClick={() => handleDownloadInvoice(selectedInvoice.id)}
                                >
                                    <Download className={styles.downloadIcon} />
                                    Baixar PDF
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
