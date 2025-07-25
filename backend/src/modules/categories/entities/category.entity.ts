import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "@/modules/users/entities/user.entity";
import { Subcategory } from "./subcategory.entity";

@Entity("categories")
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  userId?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  user?: User;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: "enum", enum: ["income", "expense", "transfer"] })
  type: string;

  @Column()
  color: string;

  @Column()
  icon: string;

  @Column({ default: false })
  isDefault: boolean;

  @Column({ nullable: true })
  parentId?: string;

  @OneToMany(() => Subcategory, subcategory => subcategory.category)
  subcategories?: Subcategory[];

  @Column({ default: 0 })
  order: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 