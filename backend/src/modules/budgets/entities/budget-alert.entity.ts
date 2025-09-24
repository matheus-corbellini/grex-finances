import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Budget } from "./budget.entity";

@Entity("budget_alerts")
export class BudgetAlert {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  budgetId: string;

  @ManyToOne(() => Budget)
  @JoinColumn()
  budget: Budget;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  threshold: number;

  @Column({ type: "varchar" })
  type: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isTriggered: boolean;

  @Column({ type: "timestamp", nullable: true })
  triggeredAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
