"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "../../../../components/layout";
import billingService from "../../../../services/api/billing.service";
import { SubscriptionPlan, PaymentMethod, BillingAddress } from "../../../../../shared/types";
import {
    CreditCard,
    Lock,
    Check,
    ArrowLeft,
    ArrowRight,
    Loader2,
    AlertCircle,
    MapPin,
    Mail,
    Phone,
    Calendar,
    Shield,
    Zap,
    Crown,
    Star
} from "lucide-react";
import styles from "./Checkout.module.css";

export default function CheckoutPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const planId = searchParams.get('planId');

    const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<'payment' | 'billing' | 'confirmation'>('payment');

    // Payment form state
    const [paymentForm, setPaymentForm] = useState({
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvc: '',
        name: '',
        email: '',
        phone: ''
    });

    // Billing address state
    const [billingAddress, setBillingAddress] = useState<BillingAddress>({
        line1: '',
        line2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'BR'
    });

    useEffect(() => {
        loadData();
    }, [planId]);

    const loadData = async () => {
        if (!planId) {
            router.push('/dashboard/billing/plans');
            return;
        }

        try {
            setLoading(true);
            const [planData, paymentMethodsData] = await Promise.all([
                billingService.getPlan(planId),
                billingService.getPaymentMethods()
            ]);

            setPlan(planData);
            setPaymentMethods(paymentMethodsData);

            if (paymentMethodsData.length > 0) {
                const defaultMethod = paymentMethodsData.find(m => m.isDefault) || paymentMethodsData[0];
                setSelectedPaymentMethod(defaultMethod.id);
            }
        } catch (err) {
            setError('Erro ao carregar dados do checkout');
            console.error('Error loading checkout data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentMethodChange = (methodId: string) => {
        setSelectedPaymentMethod(methodId);
    };

    const handlePaymentFormChange = (field: string, value: string) => {
        setPaymentForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleBillingAddressChange = (field: keyof BillingAddress, value: string) => {
        setBillingAddress(prev => ({
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
        if (!selectedPaymentMethod && !paymentForm.cardNumber) {
            setError('Selecione um método de pagamento ou adicione um novo cartão');
            return false;
        }

        if (!paymentForm.cardNumber && !selectedPaymentMethod) {
            if (!paymentForm.name || !paymentForm.email) {
                setError('Preencha todos os campos obrigatórios');
                return false;
            }
        }

        return true;
    };

    const handleSubmitPayment = async () => {
        if (!validateForm()) return;

        try {
            setProcessing(true);
            setError(null);

            let paymentMethodId = selectedPaymentMethod;

            // Create new payment method if needed
            if (!selectedPaymentMethod && paymentForm.cardNumber) {
                const newPaymentMethod = await billingService.createPaymentMethod({
                    type: 'card',
                    cardDetails: {
                        number: paymentForm.cardNumber.replace(/\s/g, ''),
                        expiryMonth: parseInt(paymentForm.expiryMonth),
                        expiryYear: parseInt(paymentForm.expiryYear),
                        cvc: paymentForm.cvc,
                        name: paymentForm.name
                    }
                });
                paymentMethodId = newPaymentMethod.id;
            }

            // Create subscription
            await billingService.createSubscription({
                planId: plan!.id,
                paymentMethodId: paymentMethodId!,
                billingAddress: Object.values(billingAddress).some(v => v) ? billingAddress : undefined
            });

            router.push('/dashboard/billing/success');
        } catch (err) {
            setError('Erro ao processar pagamento. Tente novamente.');
            console.error('Error processing payment:', err);
        } finally {
            setProcessing(false);
        }
    };

    const formatPrice = (price: number, currency: string) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: currency.toUpperCase()
        }).format(price);
    };

    const getPlanIcon = (planName: string) => {
        if (planName.toLowerCase().includes('basic')) return <Zap className={styles.planIcon} />;
        if (planName.toLowerCase().includes('pro')) return <Crown className={styles.planIcon} />;
        if (planName.toLowerCase().includes('enterprise')) return <Star className={styles.planIcon} />;
        return <CreditCard className={styles.planIcon} />;
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className={styles.loadingContainer}>
                    <Loader2 className={styles.spinner} />
                    <p>Carregando checkout...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (!plan) {
        return (
            <DashboardLayout>
                <div className={styles.errorContainer}>
                    <AlertCircle className={styles.errorIcon} />
                    <p>Plano não encontrado</p>
                    <button onClick={() => router.push('/dashboard/billing/plans')} className={styles.retryButton}>
                        Voltar aos planos
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <button
                        onClick={() => router.push('/dashboard/billing/plans')}
                        className={styles.backButton}
                    >
                        <ArrowLeft className={styles.backIcon} />
                        Voltar aos planos
                    </button>
                    <h1>Finalizar assinatura</h1>
                    <p>Complete seu pagamento para ativar o plano {plan.name}</p>
                </div>

                <div className={styles.content}>
                    <div className={styles.mainContent}>
                        <div className={styles.stepIndicator}>
                            <div className={`${styles.step} ${step === 'payment' ? styles.active : styles.completed}`}>
                                <div className={styles.stepNumber}>1</div>
                                <span>Pagamento</span>
                            </div>
                            <div className={`${styles.step} ${step === 'billing' ? styles.active : ''}`}>
                                <div className={styles.stepNumber}>2</div>
                                <span>Cobrança</span>
                            </div>
                            <div className={`${styles.step} ${step === 'confirmation' ? styles.active : ''}`}>
                                <div className={styles.stepNumber}>3</div>
                                <span>Confirmação</span>
                            </div>
                        </div>

                        {error && (
                            <div className={styles.errorAlert}>
                                <AlertCircle className={styles.errorIcon} />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className={styles.paymentSection}>
                            <h2>Método de pagamento</h2>

                            {paymentMethods.length > 0 && (
                                <div className={styles.existingMethods}>
                                    <h3>Métodos salvos</h3>
                                    {paymentMethods.map((method) => (
                                        <div
                                            key={method.id}
                                            className={`${styles.paymentMethod} ${selectedPaymentMethod === method.id ? styles.selected : ''}`}
                                            onClick={() => handlePaymentMethodChange(method.id)}
                                        >
                                            <CreditCard className={styles.methodIcon} />
                                            <div className={styles.methodInfo}>
                                                <span className={styles.methodType}>
                                                    {method.brand?.toUpperCase()} •••• {method.last4}
                                                </span>
                                                <span className={styles.methodExpiry}>
                                                    {method.expiryMonth}/{method.expiryYear}
                                                </span>
                                            </div>
                                            {method.isDefault && (
                                                <span className={styles.defaultBadge}>Padrão</span>
                                            )}
                                            {selectedPaymentMethod === method.id && (
                                                <Check className={styles.checkIcon} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className={styles.divider}>
                                <span>ou</span>
                            </div>

                            <div className={styles.newPaymentMethod}>
                                <h3>Adicionar novo cartão</h3>
                                <div className={styles.cardForm}>
                                    <div className={styles.formGroup}>
                                        <label>Número do cartão</label>
                                        <input
                                            type="text"
                                            placeholder="1234 5678 9012 3456"
                                            value={paymentForm.cardNumber}
                                            onChange={(e) => handlePaymentFormChange('cardNumber', formatCardNumber(e.target.value))}
                                            maxLength={19}
                                        />
                                    </div>

                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Validade</label>
                                            <input
                                                type="text"
                                                placeholder="MM/AA"
                                                value={paymentForm.expiryMonth && paymentForm.expiryYear ?
                                                    `${paymentForm.expiryMonth}/${paymentForm.expiryYear}` : ''}
                                                onChange={(e) => {
                                                    const value = formatExpiryDate(e.target.value);
                                                    const [month, year] = value.split('/');
                                                    handlePaymentFormChange('expiryMonth', month);
                                                    handlePaymentFormChange('expiryYear', year);
                                                }}
                                                maxLength={5}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>CVV</label>
                                            <input
                                                type="text"
                                                placeholder="123"
                                                value={paymentForm.cvc}
                                                onChange={(e) => handlePaymentFormChange('cvc', e.target.value.replace(/\D/g, ''))}
                                                maxLength={4}
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Nome no cartão</label>
                                        <input
                                            type="text"
                                            placeholder="João Silva"
                                            value={paymentForm.name}
                                            onChange={(e) => handlePaymentFormChange('name', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.billingSection}>
                            <h2>Informações de cobrança</h2>
                            <div className={styles.billingForm}>
                                <div className={styles.formGroup}>
                                    <label>E-mail</label>
                                    <input
                                        type="email"
                                        placeholder="seu@email.com"
                                        value={paymentForm.email}
                                        onChange={(e) => handlePaymentFormChange('email', e.target.value)}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Telefone</label>
                                    <input
                                        type="tel"
                                        placeholder="(11) 99999-9999"
                                        value={paymentForm.phone}
                                        onChange={(e) => handlePaymentFormChange('phone', e.target.value)}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Endereço</label>
                                    <input
                                        type="text"
                                        placeholder="Rua, número"
                                        value={billingAddress.line1}
                                        onChange={(e) => handleBillingAddressChange('line1', e.target.value)}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Complemento</label>
                                    <input
                                        type="text"
                                        placeholder="Apartamento, sala, etc."
                                        value={billingAddress.line2}
                                        onChange={(e) => handleBillingAddressChange('line2', e.target.value)}
                                    />
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Cidade</label>
                                        <input
                                            type="text"
                                            placeholder="São Paulo"
                                            value={billingAddress.city}
                                            onChange={(e) => handleBillingAddressChange('city', e.target.value)}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Estado</label>
                                        <input
                                            type="text"
                                            placeholder="SP"
                                            value={billingAddress.state}
                                            onChange={(e) => handleBillingAddressChange('state', e.target.value)}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>CEP</label>
                                        <input
                                            type="text"
                                            placeholder="01234-567"
                                            value={billingAddress.postalCode}
                                            onChange={(e) => handleBillingAddressChange('postalCode', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.securitySection}>
                            <div className={styles.securityInfo}>
                                <Shield className={styles.securityIcon} />
                                <div>
                                    <h4>Seus dados estão seguros</h4>
                                    <p>Utilizamos criptografia SSL e não armazenamos dados do cartão</p>
                                </div>
                            </div>
                        </div>

                        <button
                            className={styles.submitButton}
                            onClick={handleSubmitPayment}
                            disabled={processing}
                        >
                            {processing ? (
                                <>
                                    <Loader2 className={styles.spinner} />
                                    Processando pagamento...
                                </>
                            ) : (
                                <>
                                    Finalizar assinatura
                                    <ArrowRight className={styles.buttonIcon} />
                                </>
                            )}
                        </button>
                    </div>

                    <div className={styles.sidebar}>
                        <div className={styles.orderSummary}>
                            <h3>Resumo do pedido</h3>

                            <div className={styles.planSummary}>
                                <div className={styles.planHeader}>
                                    {getPlanIcon(plan.name)}
                                    <div>
                                        <h4>{plan.name}</h4>
                                        <p>{plan.description}</p>
                                    </div>
                                </div>

                                <div className={styles.planPrice}>
                                    <span className={styles.price}>
                                        {formatPrice(plan.price, plan.currency)}
                                    </span>
                                    <span className={styles.period}>
                                        /{plan.billingCycle === 'monthly' ? 'mês' : 'ano'}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.featuresList}>
                                <h4>Inclui:</h4>
                                {plan.features.map((feature, index) => (
                                    <div key={index} className={styles.feature}>
                                        <Check className={styles.checkIcon} />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.total}>
                                <div className={styles.totalRow}>
                                    <span>Subtotal</span>
                                    <span>{formatPrice(plan.price, plan.currency)}</span>
                                </div>
                                <div className={styles.totalRow}>
                                    <span>Taxa de processamento</span>
                                    <span>Grátis</span>
                                </div>
                                <div className={styles.totalRow}>
                                    <span>Total</span>
                                    <span className={styles.totalAmount}>
                                        {formatPrice(plan.price, plan.currency)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
