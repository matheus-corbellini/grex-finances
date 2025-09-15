"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "../../../../components/layout";
import billingService from "../../../../services/api/billing.service";
import { PaymentMethod } from "../../../../../shared/types";
import {
    CreditCard,
    Plus,
    Trash2,
    Star,
    Edit,
    Shield,
    Loader2,
    AlertCircle,
    Check,
    X,
    Eye,
    EyeOff
} from "lucide-react";
import styles from "./PaymentMethods.module.css";

export default function PaymentMethodsPage() {
    const router = useRouter();
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
    const [deletingMethod, setDeletingMethod] = useState<PaymentMethod | null>(null);
    const [processing, setProcessing] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvc: '',
        name: '',
        isDefault: false
    });

    useEffect(() => {
        loadPaymentMethods();
    }, []);

    const loadPaymentMethods = async () => {
        try {
            setLoading(true);
            setError(null);

            // Mock data for now - replace with actual API call when backend is ready
            const mockMethods: PaymentMethod[] = [
                {
                    id: 'pm1',
                    userId: 'user1',
                    type: 'card',
                    provider: 'stripe',
                    last4: '4523',
                    brand: 'visa',
                    expiryMonth: 12,
                    expiryYear: 2025,
                    isDefault: true,
                    createdAt: new Date('2024-08-03')
                },
                {
                    id: 'pm2',
                    userId: 'user1',
                    type: 'card',
                    provider: 'stripe',
                    last4: '1234',
                    brand: 'mastercard',
                    expiryMonth: 6,
                    expiryYear: 2026,
                    isDefault: false,
                    createdAt: new Date('2024-07-15')
                }
            ];

            setPaymentMethods(mockMethods);

            // TODO: Replace with actual API call when backend is ready
            // const methods = await billingService.getPaymentMethods();
        } catch (err) {
            setError('Erro ao carregar métodos de pagamento');
            console.error('Error loading payment methods:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const formatCardNumber = (value: string) => {
        return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
    };

    const formatExpiryDate = (value: string) => {
        return value.replace(/\D/g, '').replace(/(.{2})/, '$1/');
    };

    const validateForm = () => {
        if (!formData.cardNumber || !formData.expiryMonth || !formData.expiryYear || !formData.cvc || !formData.name) {
            setError('Preencha todos os campos obrigatórios');
            return false;
        }
        return true;
    };

    const handleAddPaymentMethod = async () => {
        if (!validateForm()) return;

        try {
            setProcessing(true);
            setError(null);

            const newMethod = await billingService.createPaymentMethod({
                type: 'card',
                cardDetails: {
                    number: formData.cardNumber.replace(/\s/g, ''),
                    expiryMonth: parseInt(formData.expiryMonth),
                    expiryYear: parseInt(formData.expiryYear),
                    cvc: formData.cvc,
                    name: formData.name
                }
            });

            if (formData.isDefault) {
                await billingService.setDefaultPaymentMethod(newMethod.id);
            }

            setPaymentMethods(prev => [...prev, newMethod]);
            resetForm();
            setShowAddForm(false);
        } catch (err) {
            setError('Erro ao adicionar método de pagamento');
            console.error('Error adding payment method:', err);
        } finally {
            setProcessing(false);
        }
    };

    const handleSetDefault = async (methodId: string) => {
        try {
            setProcessing(true);
            await billingService.setDefaultPaymentMethod(methodId);
            await loadPaymentMethods(); // Reload to get updated default status
        } catch (err) {
            setError('Erro ao definir método padrão');
            console.error('Error setting default method:', err);
        } finally {
            setProcessing(false);
        }
    };

    const handleDeletePaymentMethod = async () => {
        if (!deletingMethod) return;

        try {
            setProcessing(true);
            setError(null);
            await billingService.deletePaymentMethod(deletingMethod.id);
            setPaymentMethods(prev => prev.filter(m => m.id !== deletingMethod.id));
            setDeletingMethod(null);
        } catch (err) {
            setError('Erro ao excluir método de pagamento');
            console.error('Error deleting payment method:', err);
        } finally {
            setProcessing(false);
        }
    };

    const resetForm = () => {
        setFormData({
            cardNumber: '',
            expiryMonth: '',
            expiryYear: '',
            cvc: '',
            name: '',
            isDefault: false
        });
    };

    const handleEditPaymentMethod = (method: PaymentMethod) => {
        setEditingMethod(method);
        setFormData({
            cardNumber: `**** **** **** ${method.last4}`,
            expiryMonth: method.expiryMonth?.toString() || '',
            expiryYear: method.expiryYear?.toString() || '',
            cvc: '',
            name: '',
            isDefault: method.isDefault
        });
        setShowAddForm(true);
    };

    const getCardBrand = (brand: string) => {
        switch (brand?.toLowerCase()) {
            case 'visa': return 'Visa';
            case 'mastercard': return 'Mastercard';
            case 'amex': return 'American Express';
            case 'discover': return 'Discover';
            default: return 'Cartão';
        }
    };

    const getCardIcon = (brand: string) => {
        // In a real app, you'd have specific icons for each brand
        return <CreditCard className={styles.cardIcon} />;
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className={styles.loadingContainer}>
                    <Loader2 className={styles.spinner} />
                    <p>Carregando métodos de pagamento...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Métodos de pagamento</h1>
                    <p>Gerencie seus cartões e métodos de pagamento</p>
                </div>

                {error && (
                    <div className={styles.errorAlert}>
                        <AlertCircle className={styles.errorIcon} />
                        <span>{error}</span>
                        <button onClick={() => setError(null)} className={styles.closeError}>
                            <X className={styles.closeIcon} />
                        </button>
                    </div>
                )}

                <div className={styles.content}>
                    <div className={styles.paymentMethods}>
                        <div className={styles.sectionHeader}>
                            <h2>Métodos salvos</h2>
                            <button
                                className={styles.addButton}
                                onClick={() => {
                                    resetForm();
                                    setShowAddForm(true);
                                    setEditingMethod(null);
                                }}
                            >
                                <Plus className={styles.addIcon} />
                                Adicionar cartão
                            </button>
                        </div>

                        {paymentMethods.length === 0 ? (
                            <div className={styles.emptyState}>
                                <CreditCard className={styles.emptyIcon} />
                                <h3>Nenhum método de pagamento</h3>
                                <p>Adicione um cartão para facilitar seus pagamentos</p>
                                <button
                                    className={styles.addFirstButton}
                                    onClick={() => {
                                        resetForm();
                                        setShowAddForm(true);
                                    }}
                                >
                                    <Plus className={styles.addIcon} />
                                    Adicionar primeiro cartão
                                </button>
                            </div>
                        ) : (
                            <div className={styles.methodsList}>
                                {paymentMethods.map((method) => (
                                    <div key={method.id} className={styles.methodCard}>
                                        <div className={styles.methodInfo}>
                                            <div className={styles.methodHeader}>
                                                {getCardIcon(method.brand || 'card')}
                                                <div className={styles.methodDetails}>
                                                    <h3>{getCardBrand(method.brand || 'card')}</h3>
                                                    <p>•••• •••• •••• {method.last4}</p>
                                                    <span className={styles.expiry}>
                                                        {method.expiryMonth?.toString().padStart(2, '0')}/{method.expiryYear}
                                                    </span>
                                                </div>
                                            </div>

                                            {method.isDefault && (
                                                <div className={styles.defaultBadge}>
                                                    <Star className={styles.starIcon} />
                                                    Padrão
                                                </div>
                                            )}
                                        </div>

                                        <div className={styles.methodActions}>
                                            {!method.isDefault && (
                                                <button
                                                    className={styles.actionButton}
                                                    onClick={() => handleSetDefault(method.id)}
                                                    disabled={processing}
                                                    title="Definir como padrão"
                                                >
                                                    <Star className={styles.actionIcon} />
                                                </button>
                                            )}
                                            <button
                                                className={styles.actionButton}
                                                onClick={() => handleEditPaymentMethod(method)}
                                                title="Editar"
                                            >
                                                <Edit className={styles.actionIcon} />
                                            </button>
                                            <button
                                                className={`${styles.actionButton} ${styles.deleteButton}`}
                                                onClick={() => setDeletingMethod(method)}
                                                title="Excluir"
                                            >
                                                <Trash2 className={styles.actionIcon} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {showAddForm && (
                        <div className={styles.addForm}>
                            <div className={styles.formHeader}>
                                <h2>{editingMethod ? 'Editar cartão' : 'Adicionar novo cartão'}</h2>
                                <button
                                    className={styles.closeFormButton}
                                    onClick={() => {
                                        setShowAddForm(false);
                                        setEditingMethod(null);
                                        resetForm();
                                    }}
                                >
                                    <X className={styles.closeIcon} />
                                </button>
                            </div>

                            <div className={styles.formContent}>
                                <div className={styles.formGroup}>
                                    <label>Número do cartão</label>
                                    <input
                                        type="text"
                                        placeholder="1234 5678 9012 3456"
                                        value={formData.cardNumber}
                                        onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                                        maxLength={19}
                                        disabled={!!editingMethod}
                                    />
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Validade</label>
                                        <input
                                            type="text"
                                            placeholder="MM/AA"
                                            value={formData.expiryMonth && formData.expiryYear ?
                                                `${formData.expiryMonth}/${formData.expiryYear}` : ''}
                                            onChange={(e) => {
                                                const value = formatExpiryDate(e.target.value);
                                                const [month, year] = value.split('/');
                                                handleInputChange('expiryMonth', month);
                                                handleInputChange('expiryYear', year);
                                            }}
                                            maxLength={5}
                                            disabled={!!editingMethod}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>CVV</label>
                                        <input
                                            type="text"
                                            placeholder="123"
                                            value={formData.cvc}
                                            onChange={(e) => handleInputChange('cvc', e.target.value.replace(/\D/g, ''))}
                                            maxLength={4}
                                            disabled={!!editingMethod}
                                        />
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Nome no cartão</label>
                                    <input
                                        type="text"
                                        placeholder="João Silva"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        disabled={!!editingMethod}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            checked={formData.isDefault}
                                            onChange={(e) => handleInputChange('isDefault', e.target.checked.toString())}
                                        />
                                        <span className={styles.checkboxText}>
                                            Definir como método de pagamento padrão
                                        </span>
                                    </label>
                                </div>

                                <div className={styles.securityInfo}>
                                    <Shield className={styles.securityIcon} />
                                    <div>
                                        <h4>Seus dados estão seguros</h4>
                                        <p>Utilizamos criptografia SSL e não armazenamos dados do cartão</p>
                                    </div>
                                </div>

                                <div className={styles.formActions}>
                                    <button
                                        className={styles.cancelButton}
                                        onClick={() => {
                                            setShowAddForm(false);
                                            setEditingMethod(null);
                                            resetForm();
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        className={styles.saveButton}
                                        onClick={handleAddPaymentMethod}
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 className={styles.spinner} />
                                                Salvando...
                                            </>
                                        ) : (
                                            <>
                                                <Check className={styles.checkIcon} />
                                                {editingMethod ? 'Atualizar' : 'Adicionar'} cartão
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Delete Confirmation Modal */}
                {deletingMethod && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <div className={styles.modalHeader}>
                                <h3>Excluir método de pagamento</h3>
                                <button
                                    className={styles.closeModalButton}
                                    onClick={() => setDeletingMethod(null)}
                                >
                                    <X className={styles.closeIcon} />
                                </button>
                            </div>
                            <div className={styles.modalContent}>
                                <p>
                                    Tem certeza que deseja excluir o cartão {getCardBrand(deletingMethod.brand || 'card')}
                                    •••• {deletingMethod.last4}?
                                </p>
                                <p className={styles.warningText}>
                                    Esta ação não pode ser desfeita.
                                </p>
                            </div>
                            <div className={styles.modalActions}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => setDeletingMethod(null)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className={styles.deleteConfirmButton}
                                    onClick={handleDeletePaymentMethod}
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className={styles.spinner} />
                                            Excluindo...
                                        </>
                                    ) : (
                                        'Excluir'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
