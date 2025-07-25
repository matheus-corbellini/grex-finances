import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "@/modules/users/entities/user.entity";

@Entity("portfolios")
export class Portfolio {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  totalValue: number;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  totalCost: number;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  totalGainLoss: number;

  @Column({ type: "decimal", precision: 8, scale: 4 })
  totalGainLossPercentage: number;

  @Column({ type: "jsonb", nullable: true })
  diversification?: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 