import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Plan } from "./plan.entity";
import { Payment } from "./payment.entity";

export enum SubscriptionStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    CANCELLED = "cancelled",
    PAST_DUE = "past_due",
    TRIALING = "trialing"
}

@Entity("subscriptions")
export class Subscription {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    userId: string;

    @Column()
    planId: string;

    @Column({ type: "enum", enum: SubscriptionStatus, default: SubscriptionStatus.INACTIVE })
    status: SubscriptionStatus;

    @Column({ nullable: true })
    stripeSubscriptionId: string;

    @Column({ nullable: true })
    mercadoPagoSubscriptionId: string;

    @Column({ nullable: true })
    currentPeriodStart: Date;

    @Column({ nullable: true })
    currentPeriodEnd: Date;

    @Column({ nullable: true })
    trialStart: Date;

    @Column({ nullable: true })
    trialEnd: Date;

    @Column({ nullable: true })
    cancelledAt: Date;

    @Column({ nullable: true })
    cancelReason: string;

    @Column({ default: false })
    autoRenew: boolean;

    @Column("simple-json", { nullable: true })
    metadata: Record<string, any>;

    @ManyToOne(() => User, user => user.subscriptions, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user: User;

    @ManyToOne(() => Plan, plan => plan.subscriptions, { onDelete: "CASCADE" })
    @JoinColumn({ name: "planId" })
    plan: Plan;

    @OneToMany(() => Payment, payment => payment.subscription)
    payments: Payment[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
