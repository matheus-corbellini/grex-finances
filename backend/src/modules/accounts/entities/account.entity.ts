import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "@/modules/users/entities/user.entity";
import { AccountType } from "./account-type.entity";

@Entity("accounts")
export class Account {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  name: string;

  @Column()
  typeId: string;

  @ManyToOne(() => AccountType)
  @JoinColumn()
  type: AccountType;

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  balance: number;

  @Column({ default: "BRL" })
  currency: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  bankName?: string;

  @Column({ nullable: true })
  accountNumber?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ nullable: true })
  icon?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 