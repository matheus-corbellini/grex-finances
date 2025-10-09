import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { BudgetCategory } from "./budget-category.entity";
import { BudgetAlert } from "./budget-alert.entity";

@Entity("budgets")
export class Budget {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: "varchar" })
  period: string;

  @Column({ type: "timestamp" })
  startDate: Date;

  @Column({ type: "timestamp" })
  endDate: Date;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  totalAmount: number;

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  spentAmount: number;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  remainingAmount: number;

  @OneToMany(() => BudgetCategory, budgetCategory => budgetCategory.budget)
  categories: BudgetCategory[];

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => BudgetAlert, budgetAlert => budgetAlert.budget)
  alerts: BudgetAlert[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 