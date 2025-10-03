import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Account } from '../../accounts/entities/account.entity';
import { Category } from '../../categories/entities/category.entity';
import { RecurringTransaction } from './recurring-transaction.entity';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer'
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'varchar',
    length: 20
  })
  type: TransactionType;

  @Column({
    type: 'varchar',
    length: 20,
    default: TransactionStatus.COMPLETED
  })
  status: TransactionStatus;

  @Column()
  accountId: string;

  @Column({ nullable: true })
  categoryId?: string;

  @Column('timestamp')
  date: Date;

  @Column('text', { nullable: true })
  notes?: string;

  @Column({ default: false })
  isRecurring: boolean;

  @Column({ nullable: true })
  recurringTransactionId?: string;

  @Column({ nullable: true })
  externalId?: string; // ID externo para integração

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relacionamentos
  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'categoryId' })
  category?: Category;

  // Relacionamento com transação recorrente (temporariamente comentado)
  // @ManyToOne(() => RecurringTransaction, { nullable: true })
  // @JoinColumn({ name: 'recurringTransactionId' })
  // recurringTransaction?: RecurringTransaction;
}