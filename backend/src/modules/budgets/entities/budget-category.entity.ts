import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Budget } from "./budget.entity";

@Entity("budget_categories")
export class BudgetCategory {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  budgetId: string;

  @ManyToOne(() => Budget, budget => budget.categories)
  @JoinColumn()
  budget: Budget;

  @Column()
  categoryId: string;

  @Column({ nullable: true })
  subcategoryId?: string;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  allocatedAmount: number;

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  spentAmount: number;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  remainingAmount: number;

  @Column({ type: "decimal", precision: 5, scale: 2, default: 80 })
  warningThreshold: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 