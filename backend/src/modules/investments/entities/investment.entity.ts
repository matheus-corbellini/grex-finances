import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Portfolio } from "./portfolio.entity";
import { InvestmentType } from "./investment-type.entity";

@Entity("investments")
export class Investment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  portfolioId: string;

  @ManyToOne(() => Portfolio)
  @JoinColumn()
  portfolio: Portfolio;

  @Column()
  symbol: string;

  @Column()
  name: string;

  @Column()
  typeId: string;

  @ManyToOne(() => InvestmentType)
  @JoinColumn()
  type: InvestmentType;

  @Column({ type: "decimal", precision: 15, scale: 6 })
  quantity: number;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  currentPrice: number;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  purchasePrice: number;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  totalValue: number;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  totalCost: number;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  gainLoss: number;

  @Column({ type: "decimal", precision: 8, scale: 4 })
  gainLossPercentage: number;

  @Column({ type: "decimal", precision: 8, scale: 4, nullable: true })
  dividendYield?: number;

  @Column({ nullable: true })
  sector?: string;

  @Column({ nullable: true })
  exchange?: string;

  @Column({ type: "timestamp" })
  lastUpdated: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 