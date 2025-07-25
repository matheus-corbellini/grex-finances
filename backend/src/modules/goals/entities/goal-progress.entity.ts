import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Goal } from "./goal.entity";

@Entity("goal_progress")
export class GoalProgress {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  goalId: string;

  @ManyToOne(() => Goal, goal => goal.progress)
  @JoinColumn()
  goal: Goal;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  note?: string;

  @Column({ type: "timestamp" })
  date: Date;

  @Column({ nullable: true })
  transactionId?: string;

  @CreateDateColumn()
  createdAt: Date;
} 