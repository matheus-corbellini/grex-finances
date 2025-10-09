import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from "typeorm";
import { User } from "./user.entity";
import { Role } from "./role.entity";

@Entity("user_roles")
@Index(["userId", "roleId"], { unique: true })
export class UserRole {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 255 })
    userId: string;

    @Column()
    roleId: string;

    @Column({ nullable: true })
    assignedBy: string; // ID do usuário que atribuiu o role

    @Column({ nullable: true })
    reason: string; // Motivo da atribuição

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true })
    expiresAt: Date; // Role temporário

    @ManyToOne(() => User, user => user.userRoles, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user: User;

    @ManyToOne(() => Role, role => role.userRoles, { onDelete: "CASCADE" })
    @JoinColumn({ name: "roleId" })
    role: Role;

    @CreateDateColumn()
    createdAt: Date;
}
