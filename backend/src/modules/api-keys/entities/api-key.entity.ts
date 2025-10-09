import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity("api_keys")
export class ApiKey {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 255 })
    userId: string;

    @ManyToOne(() => User)
    @JoinColumn()
    user: User;

    @Column({ unique: true })
    keyHash: string; // Hash da chave para segurança

    @Column()
    name: string; // Nome descritivo da chave

    @Column({ nullable: true })
    description?: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: "timestamp", nullable: true })
    expiresAt?: Date;

    @Column({ type: "simple-json", default: "{}" })
    permissions: {
        contacts: boolean;
        transactions: boolean;
        webhooks: boolean;
    };

    @Column({ type: "simple-json", default: "[]" })
    allowedIps: string[]; // IPs permitidos (vazio = todos)

    @Column({ default: 0 })
    usageCount: number;

    @Column({ type: "timestamp", nullable: true })
    lastUsedAt?: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
