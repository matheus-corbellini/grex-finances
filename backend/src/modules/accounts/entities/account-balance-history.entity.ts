import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Account } from "./account.entity";

@Entity("account_balance_history")
export class AccountBalanceHistory {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    accountId: string;

    @ManyToOne(() => Account)
    @JoinColumn()
    account: Account;

    @Column({ type: "decimal", precision: 15, scale: 2 })
    previousBalance: number;

    @Column({ type: "decimal", precision: 15, scale: 2 })
    newBalance: number;

    @Column({ type: "decimal", precision: 15, scale: 2 })
    difference: number;

    @Column({ nullable: true })
    reason?: string;

    @Column({ nullable: true })
    transactionId?: string;

    @Column({ default: "manual" })
    source: string; // 'manual', 'transaction', 'sync', 'adjustment'

    @CreateDateColumn()
    createdAt: Date;
}
