import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { User } from "@/modules/users/entities/user.entity";
import { Investment } from "./investment.entity";

@Entity("investment_transactions")
export class InvestmentTransaction {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  investmentId: string;

  @ManyToOne(() => Investment)
  @JoinColumn()
  investment: Investment;

  @Column({ type: "enum", enum: ["buy", "sell", "dividend", "split", "merger"] })
  type: string;

  @Column({ type: "decimal", precision: 15, scale: 6 })
  quantity: number;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  price: number;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  totalAmount: number;

  @Column({ type: "decimal", precision: 15, scale: 2, nullable: true })
  fees?: number;

  @Column({ type: "timestamp" })
  date: Date;

  @Column({ nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;
} 