import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "@/modules/users/entities/user.entity";
import { Account } from "@/modules/accounts/entities/account.entity";

@Entity("recurring_transactions")
export class RecurringTransaction {
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

  @Column()
  description: string;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  notes?: string;

  @Column({ type: "varchar" })
  type: string;

  @Column({ type: "varchar" })
  frequency: string;

  @Column({ type: "datetime" })
  startDate: Date;

  @Column({ type: "datetime", nullable: true })
  endDate?: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: "simple-json", nullable: true })
  tags?: string[];

  @Column({ nullable: true })
  categoryId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 