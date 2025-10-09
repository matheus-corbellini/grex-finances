import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { GoalProgress } from "./goal-progress.entity";

@Entity("goals")
export class Goal {
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
  type: string;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  targetAmount: number;

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  currentAmount: number;

  @Column({ type: "timestamp" })
  targetDate: Date;

  @Column({ type: "varchar" })
  priority: string;

  @Column({ type: "varchar", default: "active" })
  status: string;

  @Column({ nullable: true })
  accountId?: string;

  @Column({ nullable: true })
  categoryId?: string;

  @Column({ nullable: true })
  icon?: string;

  @Column({ nullable: true })
  color?: string;

  @OneToMany(() => GoalProgress, goalProgress => goalProgress.goal)
  progress: GoalProgress[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 