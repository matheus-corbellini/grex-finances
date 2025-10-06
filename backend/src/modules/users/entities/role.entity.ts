import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { UserRole } from "./user-role.entity";

export enum Permission {
    // Usuários
    USER_CREATE = "user:create",
    USER_READ = "user:read",
    USER_UPDATE = "user:update",
    USER_DELETE = "user:delete",
    USER_MANAGE_ROLES = "user:manage_roles",

    // Organização
    ORGANIZATION_READ = "organization:read",
    ORGANIZATION_UPDATE = "organization:update",
    ORGANIZATION_MANAGE_SETTINGS = "organization:manage_settings",

    // Transações
    TRANSACTION_CREATE = "transaction:create",
    TRANSACTION_READ = "transaction:read",
    TRANSACTION_UPDATE = "transaction:update",
    TRANSACTION_DELETE = "transaction:delete",
    TRANSACTION_APPROVE = "transaction:approve",

    // Contas
    ACCOUNT_CREATE = "account:create",
    ACCOUNT_READ = "account:read",
    ACCOUNT_UPDATE = "account:update",
    ACCOUNT_DELETE = "account:delete",

    // Categorias
    CATEGORY_CREATE = "category:create",
    CATEGORY_READ = "category:read",
    CATEGORY_UPDATE = "category:update",
    CATEGORY_DELETE = "category:delete",

    // Contatos
    CONTACT_CREATE = "contact:create",
    CONTACT_READ = "contact:read",
    CONTACT_UPDATE = "contact:update",
    CONTACT_DELETE = "contact:delete",

    // Relatórios
    REPORT_READ = "report:read",
    REPORT_EXPORT = "report:export",

    // Billing
    BILLING_READ = "billing:read",
    BILLING_MANAGE = "billing:manage",

    // API Keys
    API_KEY_CREATE = "api_key:create",
    API_KEY_READ = "api_key:read",
    API_KEY_UPDATE = "api_key:update",
    API_KEY_DELETE = "api_key:delete",

    // Webhooks
    WEBHOOK_CREATE = "webhook:create",
    WEBHOOK_READ = "webhook:read",
    WEBHOOK_UPDATE = "webhook:update",
    WEBHOOK_DELETE = "webhook:delete",

    // Administração
    ADMIN_ALL = "admin:all"
}

@Entity("roles")
export class Role {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column("simple-array", { default: "" })
    permissions: Permission[];

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: false })
    isSystem: boolean; // Roles do sistema não podem ser deletadas

    @OneToMany(() => UserRole, userRole => userRole.role)
    userRoles: UserRole[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
