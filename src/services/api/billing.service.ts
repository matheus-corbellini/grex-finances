import BaseApiService from "./base.service";
import {
    SubscriptionPlan,
    Subscription,
    PaymentMethod,
    Payment,
    Invoice,
    CreateSubscriptionDto,
    UpdateSubscriptionDto,
    CreatePaymentMethodDto,
    Coupon,
    UsageStats,
    BillingSummary,
    PaginatedResponse,
    RequestOptions,
} from "../../../shared/types";

class BillingService extends BaseApiService {
    // Subscription Plans
    async getPlans(): Promise<SubscriptionPlan[]> {
        return this.get<SubscriptionPlan[]>("/billing/plans");
    }

    async getPlan(id: string): Promise<SubscriptionPlan> {
        return this.get<SubscriptionPlan>(`/billing/plans/${id}`);
    }

    // Subscriptions
    async getSubscription(): Promise<Subscription> {
        return this.get<Subscription>("/billing/subscription");
    }

    async createSubscription(data: CreateSubscriptionDto): Promise<Subscription> {
        return this.post<Subscription>("/billing/subscription", data);
    }

    async updateSubscription(data: UpdateSubscriptionDto): Promise<Subscription> {
        return this.patch<Subscription>("/billing/subscription", data);
    }

    async cancelSubscription(): Promise<Subscription> {
        return this.delete<Subscription>("/billing/subscription");
    }

    async reactivateSubscription(): Promise<Subscription> {
        return this.post<Subscription>("/billing/subscription/reactivate");
    }

    // Payment Methods
    async getPaymentMethods(): Promise<PaymentMethod[]> {
        return this.get<PaymentMethod[]>("/billing/payment-methods");
    }

    async createPaymentMethod(data: CreatePaymentMethodDto): Promise<PaymentMethod> {
        return this.post<PaymentMethod>("/billing/payment-methods", data);
    }

    async updatePaymentMethod(id: string, data: Partial<CreatePaymentMethodDto>): Promise<PaymentMethod> {
        return this.patch<PaymentMethod>(`/billing/payment-methods/${id}`, data);
    }

    async deletePaymentMethod(id: string): Promise<void> {
        await this.delete(`/billing/payment-methods/${id}`);
    }

    async setDefaultPaymentMethod(id: string): Promise<PaymentMethod> {
        return this.patch<PaymentMethod>(`/billing/payment-methods/${id}/default`);
    }

    // Payments
    async getPayments(options?: RequestOptions): Promise<PaginatedResponse<Payment>> {
        return this.getPaginated<Payment>("/billing/payments", options);
    }

    async getPayment(id: string): Promise<Payment> {
        return this.get<Payment>(`/billing/payments/${id}`);
    }

    async retryPayment(id: string): Promise<Payment> {
        return this.post<Payment>(`/billing/payments/${id}/retry`);
    }

    async refundPayment(id: string, amount?: number): Promise<Payment> {
        return this.post<Payment>(`/billing/payments/${id}/refund`, { amount });
    }

    // Invoices
    async getInvoices(options?: RequestOptions): Promise<PaginatedResponse<Invoice>> {
        return this.getPaginated<Invoice>("/billing/invoices", options);
    }

    async getInvoice(id: string): Promise<Invoice> {
        return this.get<Invoice>(`/billing/invoices/${id}`);
    }

    async downloadInvoice(id: string): Promise<Blob> {
        return this.get<Blob>(`/billing/invoices/${id}/download`, {
            responseType: 'blob'
        });
    }

    // Coupons
    async getCoupons(): Promise<Coupon[]> {
        return this.get<Coupon[]>("/billing/coupons");
    }

    async validateCoupon(code: string): Promise<Coupon> {
        return this.get<Coupon>(`/billing/coupons/validate/${code}`);
    }

    // Usage and Billing Summary
    async getUsageStats(): Promise<UsageStats> {
        return this.get<UsageStats>("/billing/usage");
    }

    async getBillingSummary(): Promise<BillingSummary> {
        return this.get<BillingSummary>("/billing/summary");
    }

    // Payment Provider Integration
    async createPaymentIntent(amount: number, currency: string, paymentMethodId?: string): Promise<{
        clientSecret: string;
        paymentIntentId: string;
    }> {
        return this.post<{
            clientSecret: string;
            paymentIntentId: string;
        }>("/billing/payment-intent", {
            amount,
            currency,
            paymentMethodId
        });
    }

    async confirmPaymentIntent(paymentIntentId: string): Promise<Payment> {
        return this.post<Payment>(`/billing/payment-intent/${paymentIntentId}/confirm`);
    }

    // Webhook handling
    async handleWebhook(payload: any, signature: string): Promise<void> {
        return this.post<void>("/billing/webhooks", payload, {
            headers: {
                'stripe-signature': signature
            }
        });
    }
}

export default new BillingService();