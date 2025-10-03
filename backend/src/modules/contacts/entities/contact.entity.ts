import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity("contacts")
export class Contact {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    userId: string;

    @ManyToOne(() => User)
    @JoinColumn()
    user: User;

    @Column({ nullable: true })
    externalId?: string; // ID externo para integração

    @Column()
    name: string;

    @Column({ nullable: true })
    email?: string;

    @Column({ nullable: true })
    phone?: string;

    @Column({ nullable: true })
    document?: string; // CPF/CNPJ

    @Column({ type: "simple-json", nullable: true })
    address?: {
        street?: string;
        number?: string;
        complement?: string;
        neighborhood?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
    };

    @Column({ type: "simple-json", default: "{}" })
    metadata?: Record<string, any>;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
