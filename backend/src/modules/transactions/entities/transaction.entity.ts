import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "@/modules/users/entities/user.entity";
import { Account } from "@/modules/accounts/entities/account.entity";

@Entity("transactions")
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  accountId: string;

  @ManyToOne(() => Account)
  @JoinColumn()
  account: Account;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  amount: number;

  @Column()
  description: string;

  @Column({ nullable: true })
  notes?: string;

  @Column({ type: "enum", enum: ["income", "expense", "transfer"] })
  type: string;

  @Column({ type: "enum", enum: ["pending", "completed", "cancelled", "failed"], default: "completed" })
  status: string;

  @Column({ type: "timestamp" })
  date: Date;

  @Column({ type: "jsonb", nullable: true })
  tags?: string[];

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  receipt?: string;

  @Column({ default: false })
  isRecurring: boolean;

  @Column({ nullable: true })
  recurringTransactionId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 