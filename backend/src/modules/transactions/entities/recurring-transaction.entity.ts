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

  @Column({ nullable: true })
  categoryId?: string;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  amount: number;

  @Column()
  description: string;

  @Column({ type: "enum", enum: ["income", "expense", "transfer"] })
  type: string;

  @Column({ type: "enum", enum: ["daily", "weekly", "monthly", "quarterly", "yearly"] })
  frequency: string;

  @Column({ type: "timestamp" })
  startDate: Date;

  @Column({ type: "timestamp", nullable: true })
  endDate?: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: "timestamp" })
  nextExecutionDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 