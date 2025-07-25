import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Category } from "./category.entity";

@Entity("subcategories")
export class Subcategory {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  categoryId: string;

  @ManyToOne(() => Category, category => category.subcategories)
  @JoinColumn()
  category: Category;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ nullable: true })
  icon?: string;

  @Column({ default: 0 })
  order: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 