import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity("user_profiles")
export class UserProfile {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ type: "date", nullable: true })
  dateOfBirth?: Date;

  @Column({ type: "enum", enum: ["male", "female", "other"], nullable: true })
  gender?: "male" | "female" | "other";

  @Column({ type: "jsonb", nullable: true })
  address?: any;

  @Column({ type: "jsonb", default: {} })
  preferences: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 