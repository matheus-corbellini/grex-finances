"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "../../../../components/layout";
import billingService from "../../../../services/api/billing.service";
import { SubscriptionPlan, Subscription } from "../../../../../shared/types";
import {
    Check,
    Crown,
    Users,
    CreditCard,
    BarChart3,
    Headphones,
    Zap,
    ArrowRight,
    Star,
    Loader2,
    AlertCircle
} from "lucide-react";
import styles from "./Plans.module.css";

export default function PlansPage() {
    const router = useRouter();
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);

            // Mock data for now - replace with actual API calls when backend is ready
            const mockPlans: SubscriptionPlan[] = [
                // Planos Mensais
                {
                    id: 'start-monthly',
                    name: 'Plano Start',
                    description: 'Ideal para igrejas pequenas',
                    price: 80,
                    currency: 'BRL',
                    billingCycle: 'monthly',
                    features: [
                        'Até 5 usuários',
                        'Até 10 contas',
                        'Relatórios básicos',
                        'Suporte por e-mail'
                    ],
                    maxUsers: 5,
                    maxAccounts: 10,
                    includesReports: true,
                    includesSupport: 'basic',
                    trialDays: 14
                },
                {
                    id: 'pro-monthly',
                    name: 'Plano Pro',
                    description: 'Para igrejas em crescimento',
                    price: 150,
                    currency: 'BRL',
                    billingCycle: 'monthly',
                    features: [
                        'Até 20 usuários',
                        'Até 50 contas',
                        'Relatórios avançados',
                        'Suporte prioritário',
                        'Integrações'
                    ],
                    isPopular: true,
                    maxUsers: 20,
                    maxAccounts: 50,
                    includesReports: true,
                    includesSupport: 'priority',
                    trialDays: 14
                },
                {
                    id: 'enterprise-monthly',
                    name: 'Plano Enterprise',
                    description: 'Para grandes igrejas',
                    price: 300,
                    currency: 'BRL',
                    billingCycle: 'monthly',
                    features: [
                        'Usuários ilimitados',
                        'Contas ilimitadas',
                        'Relatórios personalizados',
                        'Suporte dedicado',
                        'Todas as integrações',
                        'API personalizada'
                    ],
                    maxUsers: -1,
                    maxAccounts: -1,
                    includesReports: true,
                    includesSupport: 'dedicated',
                    trialDays: 14
                },
                // Planos Anuais (com desconto de 20%)
                {
                    id: 'start-yearly',
                    name: 'Plano Start',
                    description: 'Ideal para igrejas pequenas',
                    price: 768, // 80 * 12 * 0.8 (20% desconto)
                    currency: 'BRL',
                    billingCycle: 'yearly',
                    features: [
                        'Até 5 usuários',
                        'Até 10 contas',
                        'Relatórios básicos',
                        'Suporte por e-mail'
                    ],
                    maxUsers: 5,
                    maxAccounts: 10,
                    includesReports: true,
                    includesSupport: 'basic',
                    trialDays: 14
                },
                {
                    id: 'pro-yearly',
                    name: 'Plano Pro',
                    description: 'Para igrejas em crescimento',
                    price: 1440, // 150 * 12 * 0.8 (20% desconto)
                    currency: 'BRL',
                    billingCycle: 'yearly',
                    features: [
                        'Até 20 usuários',
                        'Até 50 contas',
                        'Relatórios avançados',
                        'Suporte prioritário',
                        'Integrações'
                    ],
                    isPopular: true,
                    maxUsers: 20,
                    maxAccounts: 50,
                    includesReports: true,
                    includesSupport: 'priority',
                    trialDays: 14
                },
                {
                    id: 'enterprise-yearly',
                    name: 'Plano Enterprise',
                    description: 'Para grandes igrejas',
                    price: 2880, // 300 * 12 * 0.8 (20% desconto)
                    currency: 'BRL',
                    billingCycle: 'yearly',
                    features: [
                        'Usuários ilimitados',
                        'Contas ilimitadas',
                        'Relatórios personalizados',
                        'Suporte dedicado',
                        'Todas as integrações',
                        'API personalizada'
                    ],
                    maxUsers: -1,
                    maxAccounts: -1,
                    includesReports: true,
                    includesSupport: 'dedicated',
                    trialDays: 14
                }
            ];

            const mockSubscription: Subscription = {
                id: 'sub1',
                userId: 'user1',
                planId: 'start-monthly',
                plan: mockPlans[0], // Plano Start mensal
                status: 'active',
                currentPeriodStart: new Date('2024-08-03'),
                currentPeriodEnd: new Date('2024-09-03'),
                cancelAtPeriodEnd: false,
                createdAt: new Date('2024-08-03'),
                updatedAt: new Date('2024-08-03')
            };

            setPlans(mockPlans);
            setCurrentSubscription(mockSubscription);
            setSelectedPlan('start-monthly');

            // TODO: Replace with actual API calls when backend is ready
            // const [plansData, subscriptionData] = await Promise.all([
            //   billingService.getPlans(),
            //   billingService.getSubscription().catch(() => null)
            // ]);
        } catch (err) {
            setError('Erro ao carregar os planos');
            console.error('Error loading plans:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectPlan = (planId: string) => {
        if (currentSubscription?.planId === planId) {
            return; // Don't allow selecting current plan
        }
        setSelectedPlan(planId);
    };

    const handleUpgradeDowngrade = async () => {
        if (!selectedPlan) return;

        try {
            setLoading(true);
            await billingService.updateSubscription({ planId: selectedPlan });
            router.push('/dashboard/billing/checkout');
        } catch (err) {
            setError('Erro ao alterar plano');
            console.error('Error updating subscription:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: number, currency: string, billingCycle: string) => {
        const formattedPrice = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: currency.toUpperCase()
        }).format(price);

        if (billingCycle === 'yearly') {
            const monthlyPrice = price / 12;
            const formattedMonthlyPrice = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: currency.toUpperCase()
            }).format(monthlyPrice);
            return `${formattedPrice} (${formattedMonthlyPrice}/mês)`;
        }

        return formattedPrice;
    };

    const getPlanIcon = (planName: string) => {
        if (planName.toLowerCase().includes('basic')) return <Zap className={styles.planIcon} />;
        if (planName.toLowerCase().includes('pro')) return <Crown className={styles.planIcon} />;
        if (planName.toLowerCase().includes('enterprise')) return <Star className={styles.planIcon} />;
        return <CreditCard className={styles.planIcon} />;
    };

    const getSupportIcon = (support: string) => {
        switch (support) {
            case 'basic': return <Headphones className={styles.featureIcon} />;
            case 'priority': return <Headphones className={styles.featureIcon} />;
            case 'dedicated': return <Users className={styles.featureIcon} />;
            default: return <Headphones className={styles.featureIcon} />;
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className={styles.loadingContainer}>
                    <Loader2 className={styles.spinner} />
                    <p>Carregando planos...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className={styles.errorContainer}>
                    <AlertCircle className={styles.errorIcon} />
                    <p>{error}</p>
                    <button onClick={loadData} className={styles.retryButton}>
                        Tentar novamente
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Escolha seu plano</h1>
                    <p>Selecione o plano que melhor atende às necessidades da sua igreja</p>
                </div>

                <div className={styles.billingToggle}>
                    <button
                        className={`${styles.toggleButton} ${billingCycle === 'monthly' ? styles.active : ''}`}
                        onClick={() => setBillingCycle('monthly')}
                    >
                        Mensal
                    </button>
                    <button
                        className={`${styles.toggleButton} ${billingCycle === 'yearly' ? styles.active : ''}`}
                        onClick={() => setBillingCycle('yearly')}
                    >
                        Anual
                        <span className={styles.discountBadge}>-20%</span>
                    </button>
                </div>

                <div className={styles.plansGrid}>
                    {plans
                        .filter(plan => plan.billingCycle === billingCycle)
                        .map((plan) => {
                            const isCurrentPlan = currentSubscription?.planId === plan.id;
                            const isSelected = selectedPlan === plan.id;
                            const isUpgrade = currentSubscription &&
                                plans.find(p => p.id === currentSubscription.planId)?.price < plan.price;
                            const isDowngrade = currentSubscription &&
                                plans.find(p => p.id === currentSubscription.planId)?.price > plan.price;

                            return (
                                <div
                                    key={plan.id}
                                    className={`${styles.planCard} ${isCurrentPlan ? styles.currentPlan : ''} ${isSelected ? styles.selectedPlan : ''}`}
                                    onClick={() => !isCurrentPlan && handleSelectPlan(plan.id)}
                                >
                                    {plan.isPopular && (
                                        <div className={styles.popularBadge}>
                                            <Star className={styles.starIcon} />
                                            Mais Popular
                                        </div>
                                    )}

                                    {isCurrentPlan && (
                                        <div className={styles.currentBadge}>
                                            <Check className={styles.checkIcon} />
                                            Plano Atual
                                        </div>
                                    )}

                                    <div className={styles.planHeader}>
                                        {getPlanIcon(plan.name)}
                                        <h3>{plan.name}</h3>
                                        <p className={styles.planDescription}>{plan.description}</p>
                                    </div>

                                    <div className={styles.planPrice}>
                                        <span className={styles.price}>
                                            {formatPrice(plan.price, plan.currency, plan.billingCycle)}
                                        </span>
                                        <span className={styles.billingPeriod}>
                                            /{plan.billingCycle === 'monthly' ? 'mês' : 'ano'}
                                        </span>
                                    </div>

                                    <div className={styles.planFeatures}>
                                        {plan.features.map((feature, index) => (
                                            <div key={index} className={styles.feature}>
                                                <Check className={styles.checkIcon} />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className={styles.planLimits}>
                                        {plan.maxUsers && (
                                            <div className={styles.limit}>
                                                <Users className={styles.featureIcon} />
                                                <span>Até {plan.maxUsers} usuários</span>
                                            </div>
                                        )}
                                        {plan.maxAccounts && (
                                            <div className={styles.limit}>
                                                <CreditCard className={styles.featureIcon} />
                                                <span>Até {plan.maxAccounts} contas</span>
                                            </div>
                                        )}
                                        {plan.includesReports && (
                                            <div className={styles.limit}>
                                                <BarChart3 className={styles.featureIcon} />
                                                <span>Relatórios avançados</span>
                                            </div>
                                        )}
                                        {plan.includesSupport && (
                                            <div className={styles.limit}>
                                                {getSupportIcon(plan.includesSupport)}
                                                <span>Suporte {plan.includesSupport}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.planActions}>
                                        {!isCurrentPlan && (
                                            <button
                                                className={`${styles.selectButton} ${isSelected ? styles.selectedButton : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSelectPlan(plan.id);
                                                }}
                                            >
                                                {isSelected ? (
                                                    <>
                                                        <Check className={styles.buttonIcon} />
                                                        Selecionado
                                                    </>
                                                ) : (
                                                    <>
                                                        Selecionar Plano
                                                        <ArrowRight className={styles.buttonIcon} />
                                                    </>
                                                )}
                                            </button>
                                        )}

                                        {isCurrentPlan && (
                                            <div className={styles.currentPlanMessage}>
                                                Este é seu plano atual
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                </div>

                {selectedPlan && selectedPlan !== currentSubscription?.planId && (
                    <div className={styles.actionBar}>
                        <div className={styles.actionInfo}>
                            <h4>Pronto para {currentSubscription && plans.find(p => p.id === currentSubscription.planId)?.price < plans.find(p => p.id === selectedPlan)?.price ? 'fazer upgrade' : 'alterar'} seu plano?</h4>
                            <p>Você será redirecionado para a página de pagamento</p>
                        </div>
                        <button
                            className={styles.continueButton}
                            onClick={handleUpgradeDowngrade}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className={styles.spinner} />
                                    Processando...
                                </>
                            ) : (
                                <>
                                    Continuar
                                    <ArrowRight className={styles.buttonIcon} />
                                </>
                            )}
                        </button>
                    </div>
                )}

                <div className={styles.footer}>
                    <p>
                        Todos os planos incluem teste gratuito de {plans[0]?.trialDays || 14} dias.
                        Cancele a qualquer momento.
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
}
