import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity("organizations")
export class Organization {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    userId: string;

    @ManyToOne(() => User)
    @JoinColumn()
    user: User;

    // Informações básicas
    @Column()
    name: string;

    @Column({ nullable: true })
    legalName?: string;

    @Column()
    organizationType: string; // 'igreja', 'ministerio', 'ong', 'fundacao', 'outro'

    @Column({ nullable: true })
    document?: string; // CPF/CNPJ

    @Column({ nullable: true })
    phone?: string;

    @Column({ nullable: true })
    email?: string;

    @Column({ nullable: true })
    website?: string;

    // Endereço
    @Column({ nullable: true })
    zipCode?: string;

    @Column({ nullable: true })
    address?: string;

    @Column({ nullable: true })
    number?: string;

    @Column({ nullable: true })
    complement?: string;

    @Column({ nullable: true })
    neighborhood?: string;

    @Column({ nullable: true })
    city?: string;

    @Column({ nullable: true })
    state?: string;

    @Column({ nullable: true })
    country?: string;

    // Personalização
    @Column({ nullable: true })
    logo?: string; // URL da logo

    @Column({ nullable: true })
    logoPath?: string; // Caminho no Firebase Storage

    @Column({ default: "#3b82f6" })
    primaryColor: string;

    @Column({ default: "BRL" })
    currency: string;

    @Column({ default: "pt-BR" })
    language: string;

    @Column({ default: "America/Sao_Paulo" })
    timezone: string;

    @Column({ default: "DD/MM/YYYY" })
    dateFormat: string;

    // Configurações fiscais
    @Column({ default: "mensal" })
    fiscalPeriod: string; // 'mensal', 'trimestral', 'semestral', 'anual'

    @Column({ default: true })
    notifications: boolean;

    @Column({ default: true })
    defaultCategories: boolean;

    // Status
    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
