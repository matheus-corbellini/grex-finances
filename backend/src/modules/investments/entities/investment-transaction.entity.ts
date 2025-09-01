import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
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

  @Column({ type: "varchar" })
  type: string;

  @Column({ type: "decimal", precision: 15, scale: 6 })
  quantity: number;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  price: number;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  totalAmount: number;

  @Column({ type: "datetime" })
  date: Date;

  @Column({ nullable: true })
  notes?: string;

  @Column({ nullable: true })
  fees?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 