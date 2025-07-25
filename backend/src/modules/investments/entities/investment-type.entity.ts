import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("investment_types")
export class InvestmentType {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ type: "enum", enum: ["stocks", "bonds", "mutual_funds", "etf", "cryptocurrency", "real_estate", "commodities", "other"] })
  category: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: "enum", enum: ["low", "medium", "high", "very_high"] })
  riskLevel: string;
} 