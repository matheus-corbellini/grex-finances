import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Webhook } from "./webhook.entity";

@Entity("webhook_logs")
export class WebhookLog {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    webhookId: string;

    @ManyToOne(() => Webhook)
    @JoinColumn()
    webhook: Webhook;

    @Column()
    event: string;

    @Column({ type: "simple-json" })
    payload: any;

    @Column()
    url: string;

    @Column({ type: "simple-json", nullable: true })
    headers?: Record<string, string>;

    @Column({ nullable: true })
    statusCode?: number;

    @Column({ nullable: true })
    responseBody?: string;

    @Column({ nullable: true })
    errorMessage?: string;

    @Column({ default: 0 })
    responseTime: number; // em milissegundos

    @Column({ default: 0 })
    retryCount: number;

    @Column({ default: false })
    isSuccess: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
