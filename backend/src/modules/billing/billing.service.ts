import { Injectable, NotFoundException, BadRequestException, ConflictException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Plan } from "./entities/plan.entity";
import { Subscription } from "./entities/subscription.entity";
import { Payment } from "./entities/payment.entity";
import {
    CreatePlanDto,
    UpdatePlanDto,
    CreateSubscriptionDto,
    CreatePaymentDto,
    PlanResponseDto,
    SubscriptionResponseDto,
    PaymentResponseDto
} from "./dto/billing.dto";
import { PlanType, PaymentStatus, PaymentMethod, SubscriptionStatus } from "./entities/plan.entity";

@Injectable()
export class BillingService {
    private readonly logger = new Logger(BillingService.name);

    constructor(
        @InjectRepository(Plan)
        private planRepository: Repository<Plan>,
        @InjectRepository(Subscription)
        private subscriptionRepository: Repository<Subscription>,
        @InjectRepository(Payment)
        private paymentRepository: Repository<Payment>,
    ) { }

    // ===== PLAN METHODS =====

    async createPlan(createDto: CreatePlanDto): Promise<PlanResponseDto> {
        try {
            // Verificar se plano já existe
            const existingPlan = await this.planRepository.findOne({
                where: { name: createDto.name }
            });

            if (existingPlan) {
                throw new ConflictException("Plano já existe");
            }

            const plan = this.planRepository.create(createDto);
            const savedPlan = await this.planRepository.save(plan);

            this.logger.log(`Plano criado: ${savedPlan.id} - ${savedPlan.name}`);

            return this.mapPlanToResponse(savedPlan);
        } catch (error) {
            this.logger.error(`Erro ao criar plano:`, error);
            throw error;
        }
    }

    async findAllPlans(): Promise<PlanResponseDto[]> {
        try {
            const plans = await this.planRepository.find({
                where: { isActive: true },
                order: { price: 'ASC' }
            });

            return plans.map(plan => this.mapPlanToResponse(plan));
        } catch (error) {
            this.logger.error(`Erro ao buscar planos:`, error);
            throw error;
        }
    }

    async findOnePlan(id: string): Promise<PlanResponseDto> {
        try {
            const plan = await this.planRepository.findOne({ where: { id } });

            if (!plan) {
                throw new NotFoundException("Plano não encontrado");
            }

            return this.mapPlanToResponse(plan);
        } catch (error) {
            this.logger.error(`Erro ao buscar plano ${id}:`, error);
            throw error;
        }
    }

    async updatePlan(id: string, updateDto: UpdatePlanDto): Promise<PlanResponseDto> {
        try {
            const plan = await this.planRepository.findOne({ where: { id } });

            if (!plan) {
                throw new NotFoundException("Plano não encontrado");
            }

            Object.assign(plan, updateDto);
            const savedPlan = await this.planRepository.save(plan);

            this.logger.log(`Plano atualizado: ${savedPlan.id}`);

            return this.mapPlanToResponse(savedPlan);
        } catch (error) {
            this.logger.error(`Erro ao atualizar plano ${id}:`, error);
            throw error;
        }
    }

    async removePlan(id: string): Promise<void> {
        try {
            const plan = await this.planRepository.findOne({ where: { id } });

            if (!plan) {
                throw new NotFoundException("Plano não encontrado");
            }

            // Verificar se há assinaturas ativas
            const activeSubscriptions = await this.subscriptionRepository.count({
                where: { planId: id, status: SubscriptionStatus.ACTIVE }
            });

            if (activeSubscriptions > 0) {
                throw new BadRequestException("Não é possível remover plano com assinaturas ativas");
            }

            plan.isActive = false;
            await this.planRepository.save(plan);

            this.logger.log(`Plano removido: ${plan.id}`);
        } catch (error) {
            this.logger.error(`Erro ao remover plano ${id}:`, error);
            throw error;
        }
    }

    // ===== SUBSCRIPTION METHODS =====

    async createSubscription(userId: string, createDto: CreateSubscriptionDto): Promise<SubscriptionResponseDto> {
        try {
            const plan = await this.planRepository.findOne({ where: { id: createDto.planId } });

            if (!plan) {
                throw new NotFoundException("Plano não encontrado");
            }

            // Verificar se usuário já tem assinatura ativa
            const existingSubscription = await this.subscriptionRepository.findOne({
                where: { userId, status: SubscriptionStatus.ACTIVE }
            });

            if (existingSubscription) {
                throw new ConflictException("Usuário já possui assinatura ativa");
            }

            const subscription = this.subscriptionRepository.create({
                userId,
                planId: createDto.planId,
                status: SubscriptionStatus.TRIALING,
                trialStart: createDto.trialStart || new Date(),
                trialEnd: createDto.trialEnd || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 dias
                autoRenew: createDto.autoRenew ?? true
            });

            const savedSubscription = await this.subscriptionRepository.save(subscription);

            this.logger.log(`Assinatura criada: ${savedSubscription.id} para usuário ${userId}`);

            return this.mapSubscriptionToResponse(savedSubscription);
        } catch (error) {
            this.logger.error(`Erro ao criar assinatura:`, error);
            throw error;
        }
    }

    async findUserSubscription(userId: string): Promise<SubscriptionResponseDto | null> {
        try {
            const subscription = await this.subscriptionRepository.findOne({
                where: { userId },
                relations: ['plan'],
                order: { createdAt: 'DESC' }
            });

            if (!subscription) {
                return null;
            }

            return this.mapSubscriptionToResponse(subscription);
        } catch (error) {
            this.logger.error(`Erro ao buscar assinatura do usuário ${userId}:`, error);
            throw error;
        }
    }

    async updateSubscription(id: string, status: SubscriptionStatus, metadata?: any): Promise<SubscriptionResponseDto> {
        try {
            const subscription = await this.subscriptionRepository.findOne({ where: { id } });

            if (!subscription) {
                throw new NotFoundException("Assinatura não encontrada");
            }

            subscription.status = status;
            if (metadata) {
                subscription.metadata = metadata;
            }

            const savedSubscription = await this.subscriptionRepository.save(subscription);

            this.logger.log(`Assinatura atualizada: ${savedSubscription.id} - Status: ${status}`);

            return this.mapSubscriptionToResponse(savedSubscription);
        } catch (error) {
            this.logger.error(`Erro ao atualizar assinatura ${id}:`, error);
            throw error;
        }
    }

    async cancelSubscription(id: string, reason?: string): Promise<SubscriptionResponseDto> {
        try {
            const subscription = await this.subscriptionRepository.findOne({ where: { id } });

            if (!subscription) {
                throw new NotFoundException("Assinatura não encontrada");
            }

            subscription.status = SubscriptionStatus.CANCELLED;
            subscription.cancelledAt = new Date();
            subscription.cancelReason = reason;

            const savedSubscription = await this.subscriptionRepository.save(subscription);

            this.logger.log(`Assinatura cancelada: ${savedSubscription.id}`);

            return this.mapSubscriptionToResponse(savedSubscription);
        } catch (error) {
            this.logger.error(`Erro ao cancelar assinatura ${id}:`, error);
            throw error;
        }
    }

    // ===== PAYMENT METHODS =====

    async createPayment(userId: string, createDto: CreatePaymentDto): Promise<PaymentResponseDto> {
        try {
            const subscription = await this.subscriptionRepository.findOne({
                where: { id: createDto.subscriptionId },
                relations: ['plan']
            });

            if (!subscription) {
                throw new NotFoundException("Assinatura não encontrada");
            }

            if (subscription.userId !== userId) {
                throw new BadRequestException("Assinatura não pertence ao usuário");
            }

            const payment = this.paymentRepository.create({
                userId,
                subscriptionId: createDto.subscriptionId,
                amount: subscription.plan.price,
                currency: subscription.plan.currency,
                method: createDto.method,
                stripePaymentIntentId: createDto.stripePaymentIntentId,
                mercadoPagoPaymentId: createDto.mercadoPagoPaymentId,
                status: PaymentStatus.PENDING
            });

            const savedPayment = await this.paymentRepository.save(payment);

            this.logger.log(`Pagamento criado: ${savedPayment.id} para usuário ${userId}`);

            return this.mapPaymentToResponse(savedPayment);
        } catch (error) {
            this.logger.error(`Erro ao criar pagamento:`, error);
            throw error;
        }
    }

    async findUserPayments(userId: string, page: number = 1, limit: number = 10): Promise<{ payments: PaymentResponseDto[], total: number }> {
        try {
            const [payments, total] = await this.paymentRepository.findAndCount({
                where: { userId },
                order: { createdAt: 'DESC' },
                skip: (page - 1) * limit,
                take: limit
            });

            const paymentResponses = payments.map(payment => this.mapPaymentToResponse(payment));

            return { payments: paymentResponses, total };
        } catch (error) {
            this.logger.error(`Erro ao buscar pagamentos do usuário ${userId}:`, error);
            throw error;
        }
    }

    async updatePaymentStatus(id: string, status: PaymentStatus, metadata?: any): Promise<PaymentResponseDto> {
        try {
            const payment = await this.paymentRepository.findOne({ where: { id } });

            if (!payment) {
                throw new NotFoundException("Pagamento não encontrado");
            }

            payment.status = status;
            if (metadata) {
                payment.metadata = metadata;
            }

            const savedPayment = await this.paymentRepository.save(payment);

            this.logger.log(`Status do pagamento atualizado: ${savedPayment.id} - Status: ${status}`);

            return this.mapPaymentToResponse(savedPayment);
        } catch (error) {
            this.logger.error(`Erro ao atualizar status do pagamento ${id}:`, error);
            throw error;
        }
    }

    // ===== STRIPE INTEGRATION =====

    async createStripePaymentIntent(subscriptionId: string): Promise<{ clientSecret: string, paymentIntentId: string }> {
        try {
            const subscription = await this.subscriptionRepository.findOne({
                where: { id: subscriptionId },
                relations: ['plan']
            });

            if (!subscription) {
                throw new NotFoundException("Assinatura não encontrada");
            }

            // Aqui seria a integração real com Stripe
            // Por enquanto, retornamos dados mockados
            const mockPaymentIntentId = `pi_mock_${Date.now()}`;
            const mockClientSecret = `pi_mock_${Date.now()}_secret_mock`;

            this.logger.log(`Payment Intent criado (mock): ${mockPaymentIntentId}`);

            return {
                clientSecret: mockClientSecret,
                paymentIntentId: mockPaymentIntentId
            };
        } catch (error) {
            this.logger.error(`Erro ao criar Payment Intent:`, error);
            throw error;
        }
    }

    async handleStripeWebhook(payload: any): Promise<void> {
        try {
            // Aqui seria o processamento real dos webhooks do Stripe
            this.logger.log(`Webhook Stripe recebido: ${payload.type}`);

            switch (payload.type) {
                case 'payment_intent.succeeded':
                    await this.handlePaymentSuccess(payload.data.object);
                    break;
                case 'payment_intent.payment_failed':
                    await this.handlePaymentFailure(payload.data.object);
                    break;
                case 'invoice.payment_succeeded':
                    await this.handleSubscriptionRenewal(payload.data.object);
                    break;
                default:
                    this.logger.log(`Tipo de webhook não tratado: ${payload.type}`);
            }
        } catch (error) {
            this.logger.error(`Erro ao processar webhook Stripe:`, error);
            throw error;
        }
    }

    // ===== MERCADO PAGO INTEGRATION =====

    async createMercadoPagoPayment(subscriptionId: string): Promise<{ qrCode: string, paymentId: string }> {
        try {
            const subscription = await this.subscriptionRepository.findOne({
                where: { id: subscriptionId },
                relations: ['plan']
            });

            if (!subscription) {
                throw new NotFoundException("Assinatura não encontrada");
            }

            // Aqui seria a integração real com Mercado Pago
            // Por enquanto, retornamos dados mockados
            const mockPaymentId = `mp_${Date.now()}`;
            const mockQrCode = `00020126580014br.gov.bcb.pix0136${mockPaymentId}520400005303986540529.905802BR5913Teste6009Sao Paulo62070503***6304`;

            this.logger.log(`Pagamento Mercado Pago criado (mock): ${mockPaymentId}`);

            return {
                qrCode: mockQrCode,
                paymentId: mockPaymentId
            };
        } catch (error) {
            this.logger.error(`Erro ao criar pagamento Mercado Pago:`, error);
            throw error;
        }
    }

    // ===== UTILITY METHODS =====

    private async handlePaymentSuccess(paymentIntent: any): Promise<void> {
        try {
            const payment = await this.paymentRepository.findOne({
                where: { stripePaymentIntentId: paymentIntent.id }
            });

            if (payment) {
                payment.status = PaymentStatus.PAID;
                await this.paymentRepository.save(payment);

                // Ativar assinatura
                const subscription = await this.subscriptionRepository.findOne({
                    where: { id: payment.subscriptionId }
                });

                if (subscription) {
                    subscription.status = SubscriptionStatus.ACTIVE;
                    subscription.currentPeriodStart = new Date();
                    subscription.currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 dias
                    await this.subscriptionRepository.save(subscription);
                }
            }
        } catch (error) {
            this.logger.error(`Erro ao processar pagamento bem-sucedido:`, error);
        }
    }

    private async handlePaymentFailure(paymentIntent: any): Promise<void> {
        try {
            const payment = await this.paymentRepository.findOne({
                where: { stripePaymentIntentId: paymentIntent.id }
            });

            if (payment) {
                payment.status = PaymentStatus.FAILED;
                payment.failureReason = paymentIntent.last_payment_error?.message || 'Pagamento falhou';
                await this.paymentRepository.save(payment);
            }
        } catch (error) {
            this.logger.error(`Erro ao processar falha de pagamento:`, error);
        }
    }

    private async handleSubscriptionRenewal(invoice: any): Promise<void> {
        try {
            const subscription = await this.subscriptionRepository.findOne({
                where: { stripeSubscriptionId: invoice.subscription }
            });

            if (subscription) {
                subscription.currentPeriodStart = new Date(invoice.period_start * 1000);
                subscription.currentPeriodEnd = new Date(invoice.period_end * 1000);
                await this.subscriptionRepository.save(subscription);
            }
        } catch (error) {
            this.logger.error(`Erro ao processar renovação de assinatura:`, error);
        }
    }

    private mapPlanToResponse(plan: Plan): PlanResponseDto {
        return {
            id: plan.id,
            name: plan.name,
            description: plan.description,
            type: plan.type,
            price: plan.price,
            currency: plan.currency,
            billingCycle: plan.billingCycle,
            features: plan.features,
            isActive: plan.isActive,
            isPopular: plan.isPopular,
            stripePriceId: plan.stripePriceId,
            mercadoPagoPlanId: plan.mercadoPagoPlanId,
            createdAt: plan.createdAt,
            updatedAt: plan.updatedAt
        };
    }

    private mapSubscriptionToResponse(subscription: Subscription): SubscriptionResponseDto {
        return {
            id: subscription.id,
            userId: subscription.userId,
            planId: subscription.planId,
            status: subscription.status,
            stripeSubscriptionId: subscription.stripeSubscriptionId,
            mercadoPagoSubscriptionId: subscription.mercadoPagoSubscriptionId,
            currentPeriodStart: subscription.currentPeriodStart,
            currentPeriodEnd: subscription.currentPeriodEnd,
            trialStart: subscription.trialStart,
            trialEnd: subscription.trialEnd,
            cancelledAt: subscription.cancelledAt,
            cancelReason: subscription.cancelReason,
            autoRenew: subscription.autoRenew,
            plan: subscription.plan ? this.mapPlanToResponse(subscription.plan) : null,
            createdAt: subscription.createdAt,
            updatedAt: subscription.updatedAt
        };
    }

    private mapPaymentToResponse(payment: Payment): PaymentResponseDto {
        return {
            id: payment.id,
            userId: payment.userId,
            subscriptionId: payment.subscriptionId,
            amount: payment.amount,
            currency: payment.currency,
            status: payment.status,
            method: payment.method,
            stripePaymentIntentId: payment.stripePaymentIntentId,
            mercadoPagoPaymentId: payment.mercadoPagoPaymentId,
            pixCode: payment.pixCode,
            pixQrCode: payment.pixQrCode,
            bankTransferCode: payment.bankTransferCode,
            failureReason: payment.failureReason,
            refundedAt: payment.refundedAt,
            refundReason: payment.refundReason,
            createdAt: payment.createdAt,
            updatedAt: payment.updatedAt
        };
    }
}
