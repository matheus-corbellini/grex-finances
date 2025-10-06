import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Subscription } from "./subscription.entity";

export enum PlanType {
    FREE = "free",
    BASIC = "basic",
    PREMIUM = "premium",
    ENTERPRISE = "enterprise"
}

export enum PaymentStatus {
    PENDING = "pending",
    PAID = "paid",
    FAILED = "failed",
    REFUNDED = "refunded",
    CANCELLED = "cancelled"
}

export enum PaymentMethod {
    STRIPE = "stripe",
    MERCADO_PAGO = "mercado_pago",
    PIX = "pix",
    BANK_TRANSFER = "bank_transfer"
}

export enum SubscriptionStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    CANCELLED = "cancelled",
    PAST_DUE = "past_due",
    TRIALING = "trialing"
}

@Entity("plans")
export class Plan {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    name: string;

    @Column()
    description: string;

    @Column({ type: "enum", enum: PlanType })
    type: PlanType;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    price: number;

    @Column()
    currency: string;

    @Column()
    billingCycle: string; // monthly, yearly

    @Column("simple-json", { nullable: true })
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

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: false })
    isPopular: boolean;

    @Column({ nullable: true })
    stripePriceId: string;

    @Column({ nullable: true })
    mercadoPagoPlanId: string;

    @OneToMany(() => Subscription, subscription => subscription.plan)
    subscriptions: Subscription[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
