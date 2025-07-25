import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Transaction } from "./transaction.entity";

@Entity("transaction_categories")
export class TransactionCategory {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  transactionId: string;

  @ManyToOne(() => Transaction)
  @JoinColumn()
  transaction: Transaction;

  @Column()
  categoryId: string;

  @Column({ nullable: true })
  subcategoryId?: string;
} 