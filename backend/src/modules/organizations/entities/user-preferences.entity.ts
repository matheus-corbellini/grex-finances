import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity("user_preferences")
export class UserPreferences {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 255 })
    userId: string;

    @ManyToOne(() => User)
    @JoinColumn()
    user: User;

    // Preferências de exibição
    @Column({ default: "crescente" })
    orderType: string; // 'crescente', 'decrescente'

    @Column({ default: "mensal" })
    defaultPeriod: string; // 'mensal', 'trimestral', 'semestral', 'anual'

    @Column({ default: "brl" })
    defaultCurrency: string; // 'brl', 'usd', 'eur'

    // Preferências de notificação
    @Column({ default: true })
    emailNotifications: boolean;

    @Column({ default: true })
    pushNotifications: boolean;

    @Column({ default: true })
    smsNotifications: boolean;

    @Column({ type: "simple-json", default: "{}" })
    notificationSettings: {
        transactionCreated: boolean;
        transactionUpdated: boolean;
        budgetExceeded: boolean;
        paymentDue: boolean;
        reportGenerated: boolean;
        systemMaintenance: boolean;
    };

    // Preferências de dashboard
    @Column({ type: "simple-json", default: "[]" })
    dashboardWidgets: string[];

    @Column({ default: "grid" })
    dashboardLayout: string; // 'grid', 'list', 'compact'

    @Column({ default: 20 })
    itemsPerPage: number;

    // Preferências de relatórios
    @Column({ default: "pdf" })
    defaultReportFormat: string; // 'pdf', 'excel', 'csv'

    @Column({ default: true })
    includeCharts: boolean;

    @Column({ default: true })
    includeDetails: boolean;

    // Preferências de backup
    @Column({ default: true })
    autoBackup: boolean;

    @Column({ default: 7 })
    backupRetentionDays: number;

    @Column({ default: "daily" })
    backupFrequency: string; // 'daily', 'weekly', 'monthly'

    // Preferências de segurança
    @Column({ default: 30 })
    sessionTimeout: number; // minutos

    @Column({ default: true })
    twoFactorAuth: boolean;

    @Column({ default: true })
    loginNotifications: boolean;

    // Preferências de integração
    @Column({ type: "simple-json", default: "{}" })
    integrationSettings: {
        stripeWebhookUrl?: string;
        firebaseProjectId?: string;
        awsRegion?: string;
        sentryDsn?: string;
    };

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
