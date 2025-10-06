import { IsString, IsOptional, IsBoolean, IsEnum, IsNumber, IsObject, IsArray, Min, Max } from "class-validator";

export class CreateUserPreferencesDto {
    @IsOptional()
    @IsEnum(['crescente', 'decrescente'])
    orderType?: string;

    @IsOptional()
    @IsEnum(['mensal', 'trimestral', 'semestral', 'anual'])
    defaultPeriod?: string;

    @IsOptional()
    @IsEnum(['brl', 'usd', 'eur'])
    defaultCurrency?: string;

    // Preferências de notificação
    @IsOptional()
    @IsBoolean()
    emailNotifications?: boolean;

    @IsOptional()
    @IsBoolean()
    pushNotifications?: boolean;

    @IsOptional()
    @IsBoolean()
    smsNotifications?: boolean;

    @IsOptional()
    @IsObject()
    notificationSettings?: {
        transactionCreated?: boolean;
        transactionUpdated?: boolean;
        budgetExceeded?: boolean;
        paymentDue?: boolean;
        reportGenerated?: boolean;
        systemMaintenance?: boolean;
    };

    // Preferências de dashboard
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    dashboardWidgets?: string[];

    @IsOptional()
    @IsEnum(['grid', 'list', 'compact'])
    dashboardLayout?: string;

    @IsOptional()
    @IsNumber()
    @Min(5)
    @Max(100)
    itemsPerPage?: number;

    // Preferências de relatórios
    @IsOptional()
    @IsEnum(['pdf', 'excel', 'csv'])
    defaultReportFormat?: string;

    @IsOptional()
    @IsBoolean()
    includeCharts?: boolean;

    @IsOptional()
    @IsBoolean()
    includeDetails?: boolean;

    // Preferências de backup
    @IsOptional()
    @IsBoolean()
    autoBackup?: boolean;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(365)
    backupRetentionDays?: number;

    @IsOptional()
    @IsEnum(['daily', 'weekly', 'monthly'])
    backupFrequency?: string;

    // Preferências de segurança
    @IsOptional()
    @IsNumber()
    @Min(5)
    @Max(480)
    sessionTimeout?: number;

    @IsOptional()
    @IsBoolean()
    twoFactorAuth?: boolean;

    @IsOptional()
    @IsBoolean()
    loginNotifications?: boolean;

    // Preferências de integração
    @IsOptional()
    @IsObject()
    integrationSettings?: {
        stripeWebhookUrl?: string;
        firebaseProjectId?: string;
        awsRegion?: string;
        sentryDsn?: string;
    };
}

export class UpdateUserPreferencesDto {
    @IsOptional()
    @IsEnum(['crescente', 'decrescente'])
    orderType?: string;

    @IsOptional()
    @IsEnum(['mensal', 'trimestral', 'semestral', 'anual'])
    defaultPeriod?: string;

    @IsOptional()
    @IsEnum(['brl', 'usd', 'eur'])
    defaultCurrency?: string;

    // Preferências de notificação
    @IsOptional()
    @IsBoolean()
    emailNotifications?: boolean;

    @IsOptional()
    @IsBoolean()
    pushNotifications?: boolean;

    @IsOptional()
    @IsBoolean()
    smsNotifications?: boolean;

    @IsOptional()
    @IsObject()
    notificationSettings?: {
        transactionCreated?: boolean;
        transactionUpdated?: boolean;
        budgetExceeded?: boolean;
        paymentDue?: boolean;
        reportGenerated?: boolean;
        systemMaintenance?: boolean;
    };

    // Preferências de dashboard
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    dashboardWidgets?: string[];

    @IsOptional()
    @IsEnum(['grid', 'list', 'compact'])
    dashboardLayout?: string;

    @IsOptional()
    @IsNumber()
    @Min(5)
    @Max(100)
    itemsPerPage?: number;

    // Preferências de relatórios
    @IsOptional()
    @IsEnum(['pdf', 'excel', 'csv'])
    defaultReportFormat?: string;

    @IsOptional()
    @IsBoolean()
    includeCharts?: boolean;

    @IsOptional()
    @IsBoolean()
    includeDetails?: boolean;

    // Preferências de backup
    @IsOptional()
    @IsBoolean()
    autoBackup?: boolean;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(365)
    backupRetentionDays?: number;

    @IsOptional()
    @IsEnum(['daily', 'weekly', 'monthly'])
    backupFrequency?: string;

    // Preferências de segurança
    @IsOptional()
    @IsNumber()
    @Min(5)
    @Max(480)
    sessionTimeout?: number;

    @IsOptional()
    @IsBoolean()
    twoFactorAuth?: boolean;

    @IsOptional()
    @IsBoolean()
    loginNotifications?: boolean;

    // Preferências de integração
    @IsOptional()
    @IsObject()
    integrationSettings?: {
        stripeWebhookUrl?: string;
        firebaseProjectId?: string;
        awsRegion?: string;
        sentryDsn?: string;
    };
}
