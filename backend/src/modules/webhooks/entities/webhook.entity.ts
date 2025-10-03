import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity("webhooks")
export class Webhook {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    userId: string;

    @ManyToOne(() => User)
    @JoinColumn()
    user: User;

    @Column()
    name: string;

    @Column()
    url: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: "simple-json", default: "[]" })
    events: string[]; // ['contact.created', 'contact.updated', 'transaction.created', etc.]

    @Column({ type: "simple-json", default: "{}" })
    headers: Record<string, string>; // Headers customizados

    @Column({ nullable: true })
    secret?: string; // Secret para assinatura HMAC

    @Column({ default: 0 })
    successCount: number;

    @Column({ default: 0 })
    failureCount: number;

    @Column({ type: "timestamp", nullable: true })
    lastTriggeredAt?: Date;

    @Column({ type: "timestamp", nullable: true })
    lastSuccessAt?: Date;

    @Column({ type: "timestamp", nullable: true })
    lastFailureAt?: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
