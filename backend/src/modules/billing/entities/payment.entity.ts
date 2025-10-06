import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Subscription } from "./subscription.entity";
import { PaymentStatus, PaymentMethod } from "./plan.entity";

@Entity("payments")
export class Payment {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    userId: string;

    @Column()
    subscriptionId: string;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    amount: number;

    @Column()
    currency: string;

    @Column({ type: "enum", enum: PaymentStatus, default: PaymentStatus.PENDING })
    status: PaymentStatus;

    @Column({ type: "enum", enum: PaymentMethod })
    method: PaymentMethod;

    @Column({ nullable: true })
    stripePaymentIntentId: string;

    @Column({ nullable: true })
    mercadoPagoPaymentId: string;

    @Column({ nullable: true })
    pixCode: string;

    @Column({ nullable: true })
    pixQrCode: string;

    @Column({ nullable: true })
    bankTransferCode: string;

    @Column({ nullable: true })
    failureReason: string;

    @Column({ nullable: true })
    refundedAt: Date;

    @Column({ nullable: true })
    refundReason: string;

    @Column("simple-json", { nullable: true })
    metadata: Record<string, any>;

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user: User;

    @ManyToOne(() => Subscription, subscription => subscription.payments, { onDelete: "CASCADE" })
    @JoinColumn({ name: "subscriptionId" })
    subscription: Subscription;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
