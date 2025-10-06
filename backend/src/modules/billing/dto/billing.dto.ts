import { IsString, IsOptional, IsBoolean, IsEnum, IsNumber, IsDecimal, IsUUID, IsDateString, Min, Max } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PlanType, PaymentStatus, PaymentMethod } from "../entities/plan.entity";

export class CreatePlanDto {
    @ApiProperty({ example: "Plano Básico" })
    @IsString()
    name: string;

    @ApiProperty({ example: "Plano ideal para pequenas igrejas" })
    @IsString()
    description: string;

    @ApiProperty({ example: "basic", enum: PlanType })
    @IsEnum(PlanType)
    type: PlanType;

    @ApiProperty({ example: 29.90 })
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty({ example: "BRL" })
    @IsString()
    currency: string;

    @ApiProperty({ example: "monthly" })
    @IsString()
    billingCycle: string;

    @ApiProperty({ example: { maxUsers: 5, maxTransactions: 1000, apiAccess: true } })
    features: {
        maxUsers: number;
        maxTransactions: number;
        maxAccounts: number;
        maxCategories: number;
        apiAccess: boolean;
        webhooks: boolean;
        reports: boolean;
        support: string;
    };

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional({ example: false })
    @IsOptional()
    @IsBoolean()
    isPopular?: boolean;

    @ApiPropertyOptional({ example: "price_1234567890" })
    @IsOptional()
    @IsString()
    stripePriceId?: string;

    @ApiPropertyOptional({ example: "plan_1234567890" })
    @IsOptional()
    @IsString()
    mercadoPagoPlanId?: string;
}

export class UpdatePlanDto {
    @ApiPropertyOptional({ example: "Plano Básico" })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: "Plano ideal para pequenas igrejas" })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ example: 29.90 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    price?: number;

    @ApiPropertyOptional({ example: "BRL" })
    @IsOptional()
    @IsString()
    currency?: string;

    @ApiPropertyOptional({ example: "monthly" })
    @IsOptional()
    @IsString()
    billingCycle?: string;

    @ApiPropertyOptional({ example: { maxUsers: 5, maxTransactions: 1000, apiAccess: true } })
    @IsOptional()
    features?: {
        maxUsers: number;
        maxTransactions: number;
        maxAccounts: number;
        maxCategories: number;
        apiAccess: boolean;
        webhooks: boolean;
        reports: boolean;
        support: string;
    };

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional({ example: false })
    @IsOptional()
    @IsBoolean()
    isPopular?: boolean;
}

export class CreateSubscriptionDto {
    @ApiProperty({ example: "uuid-do-plano" })
    @IsUUID()
    planId: string;

    @ApiPropertyOptional({ example: "2024-12-31T23:59:59.000Z" })
    @IsOptional()
    @IsDateString()
    trialStart?: Date;

    @ApiPropertyOptional({ example: "2024-12-31T23:59:59.000Z" })
    @IsOptional()
    @IsDateString()
    trialEnd?: Date;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    autoRenew?: boolean;
}

export class CreatePaymentDto {
    @ApiProperty({ example: "uuid-da-subscription" })
    @IsUUID()
    subscriptionId: string;

    @ApiProperty({ example: "stripe", enum: PaymentMethod })
    @IsEnum(PaymentMethod)
    method: PaymentMethod;

    @ApiPropertyOptional({ example: "payment_intent_1234567890" })
    @IsOptional()
    @IsString()
    stripePaymentIntentId?: string;

    @ApiPropertyOptional({ example: "payment_1234567890" })
    @IsOptional()
    @IsString()
    mercadoPagoPaymentId?: string;
}

export class PlanResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    type: PlanType;

    @ApiProperty()
    price: number;

    @ApiProperty()
    currency: string;

    @ApiProperty()
    billingCycle: string;

    @ApiProperty()
    features: {
        maxUsers: number;
        maxTransactions: number;
        maxAccounts: number;
        maxCategories: number;
        apiAccess: boolean;
        webhooks: boolean;
        reports: boolean;
        support: string;
    };

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    isPopular: boolean;

    @ApiProperty()
    stripePriceId?: string;

    @ApiProperty()
    mercadoPagoPlanId?: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

export class SubscriptionResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    planId: string;

    @ApiProperty()
    status: string;

    @ApiProperty()
    stripeSubscriptionId?: string;

    @ApiProperty()
    mercadoPagoSubscriptionId?: string;

    @ApiProperty()
    currentPeriodStart?: Date;

    @ApiProperty()
    currentPeriodEnd?: Date;

    @ApiProperty()
    trialStart?: Date;

    @ApiProperty()
    trialEnd?: Date;

    @ApiProperty()
    cancelledAt?: Date;

    @ApiProperty()
    cancelReason?: string;

    @ApiProperty()
    autoRenew: boolean;

    @ApiProperty()
    plan: PlanResponseDto;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

export class PaymentResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    subscriptionId: string;

    @ApiProperty()
    amount: number;

    @ApiProperty()
    currency: string;

    @ApiProperty()
    status: PaymentStatus;

    @ApiProperty()
    method: PaymentMethod;

    @ApiProperty()
    stripePaymentIntentId?: string;

    @ApiProperty()
    mercadoPagoPaymentId?: string;

    @ApiProperty()
    pixCode?: string;

    @ApiProperty()
    pixQrCode?: string;

    @ApiProperty()
    bankTransferCode?: string;

    @ApiProperty()
    failureReason?: string;

    @ApiProperty()
    refundedAt?: Date;

    @ApiProperty()
    refundReason?: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
