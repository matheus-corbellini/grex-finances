// Billing and Subscription Types

export interface SubscriptionPlan {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    billingCycle: 'monthly' | 'yearly';
    features: string[];
    isPopular?: boolean;
    isCurrent?: boolean;
    maxUsers?: number;
    maxAccounts?: number;
    maxTransactions?: number;
    includesReports?: boolean;
    includesSupport?: 'basic' | 'priority' | 'dedicated';
    trialDays?: number;
}

export interface Subscription {
    id: string;
    userId: string;
    planId: string;
    plan: SubscriptionPlan;
    status: 'active' | 'inactive' | 'cancelled' | 'past_due' | 'trialing';
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
    trialStart?: Date;
    trialEnd?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface PaymentMethod {
    id: string;
    userId: string;
    type: 'card' | 'pix' | 'boleto';
    provider: 'stripe' | 'mercadopago';
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
    isDefault: boolean;
    createdAt: Date;
}

export interface Payment {
    id: string;
    userId: string;
    subscriptionId: string;
    amount: number;
    currency: string;
    status: 'pending' | 'succeeded' | 'failed' | 'cancelled' | 'refunded';
    paymentMethodId: string;
    paymentMethod: PaymentMethod;
    description: string;
    metadata?: Record<string, any>;
    paidAt?: Date;
    failedAt?: Date;
    refundedAt?: Date;
    createdAt: Date;
}

export interface Invoice {
    id: string;
    userId: string;
    subscriptionId: string;
    number: string;
    amount: number;
    currency: string;
    status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
    dueDate: Date;
    paidAt?: Date;
    periodStart: Date;
    periodEnd: Date;
    items: InvoiceItem[];
    subtotal: number;
    tax: number;
    total: number;
    createdAt: Date;
}

export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
}

export interface BillingAddress {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

export interface CreateSubscriptionDto {
    planId: string;
    paymentMethodId?: string;
    billingAddress?: BillingAddress;
    couponCode?: string;
}

export interface UpdateSubscriptionDto {
    planId?: string;
    cancelAtPeriodEnd?: boolean;
}

export interface CreatePaymentMethodDto {
    type: 'card' | 'pix' | 'boleto';
    token?: string; // For Stripe/MercadoPago tokens
    cardDetails?: {
        number: string;
        expiryMonth: number;
        expiryYear: number;
        cvc: string;
        name: string;
    };
}

export interface Coupon {
    id: string;
    code: string;
    name: string;
    description: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    currency?: string;
    validFrom: Date;
    validUntil: Date;
    maxUses?: number;
    usedCount: number;
    isActive: boolean;
}

export interface UsageStats {
    users: {
        current: number;
        limit: number;
        percentage: number;
    };
    accounts: {
        current: number;
        limit: number;
        percentage: number;
    };
    transactions: {
        current: number;
        limit: number;
        percentage: number;
    };
    storage: {
        current: number; // in MB
        limit: number; // in MB
        percentage: number;
    };
}

export interface BillingSummary {
    currentPlan: SubscriptionPlan;
    nextBillingDate: Date;
    nextBillingAmount: number;
    currency: string;
    usage: UsageStats;
    paymentMethod: PaymentMethod;
    billingEmail: string;
}
