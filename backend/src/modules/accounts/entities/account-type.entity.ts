import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("account_types")
export class AccountType {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ type: "enum", enum: ["checking", "savings", "credit_card", "investment", "cash", "loan", "other"] })
  category: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  icon?: string;
} 