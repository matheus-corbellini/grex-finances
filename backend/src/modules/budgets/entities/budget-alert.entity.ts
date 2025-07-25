import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { Budget } from "./budget.entity";

@Entity("budget_alerts")
export class BudgetAlert {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  budgetId: string;

  @ManyToOne(() => Budget, (budget) => budget.alerts)
  @JoinColumn()
  budget: Budget;

  @Column({ nullable: true })
  categoryId?: string;

  @Column({ type: "enum", enum: ["warning", "limit_reached", "over_budget"] })
  type: string;

  @Column({ type: "decimal", precision: 5, scale: 2 })
  threshold: number;

  @Column()
  message: string;

  @Column({ default: false })
  isTriggered: boolean;

  @Column({ type: "timestamp", nullable: true })
  triggeredAt?: Date;

  @CreateDateColumn()
  createdAt: Date;
}
