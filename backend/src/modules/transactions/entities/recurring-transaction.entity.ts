import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Account } from "../../accounts/entities/account.entity";
import { Category } from "../../categories/entities/category.entity";

export enum RecurringFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
  CUSTOM = 'custom'
}

export enum RecurringStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface CustomFrequencyConfig {
  type: 'days' | 'weeks' | 'months' | 'years';
  interval: number;
  daysOfWeek?: number[]; // 0-6, onde 0 = domingo
  daysOfMonth?: number[]; // 1-31
  monthsOfYear?: number[]; // 1-12
}

@Entity("recurring_transactions")
export class RecurringTransaction {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  accountId: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @Column({ nullable: true })
  categoryId?: string;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'categoryId' })
  category?: Category;

  @Column()
  description: string;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  amount: number;

  @Column({ type: "varchar" })
  type: string;

  @Column({
    type: 'varchar',
    length: 20
  })
  frequency: RecurringFrequency;

  @Column({ type: "datetime" })
  startDate: Date;

  @Column({ type: "datetime", nullable: true })
  endDate?: Date;

  @Column({
    type: 'varchar',
    length: 20,
    default: RecurringStatus.ACTIVE
  })
  status: RecurringStatus;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: true })
  autoExecute: boolean;

  @Column({ default: 1 })
  advanceDays: number;

  @Column({ nullable: true })
  notes?: string;

  @Column({ type: "simple-json", nullable: true })
  tags?: string[];

  @Column({ type: "simple-json", nullable: true })
  customFrequency?: CustomFrequencyConfig;

  @Column({ type: "datetime", nullable: true })
  lastExecutedAt?: Date;

  @Column({ type: "datetime", nullable: true })
  nextExecutionDate?: Date;

  @Column({ default: 0 })
  executionCount: number;

  @Column({ default: 0 })
  totalExecutions: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relacionamento com transações geradas
  @OneToMany('Transaction', 'recurringTransaction')
  generatedTransactions: any[];
} 