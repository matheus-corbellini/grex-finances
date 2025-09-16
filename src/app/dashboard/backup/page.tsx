"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Switch } from "../../../components/ui/Switch";
import {
    Download,
    Upload,
    Clock,
    Calendar,
    HardDrive,
    Cloud,
    Shield,
    CheckCircle,
    AlertTriangle,
    RefreshCw,
    Settings,
    FileText,
    Database,
    Users,
    DollarSign
} from "lucide-react";
import styles from "./Backup.module.css";

interface BackupJob {
    id: string;
    name: string;
    type: "manual" | "scheduled";
    status: "completed" | "running" | "failed" | "pending";
    createdAt: Date;
    completedAt?: Date;
    size: number;
    format: "sql" | "json" | "csv";
    includes: string[];
}

interface BackupSettings {
    autoBackup: boolean;
    frequency: "daily" | "weekly" | "monthly";
    retentionDays: number;
    includeFiles: boolean;
    includeUsers: boolean;
    includeTransactions: boolean;
    includeReports: boolean;
    cloudStorage: boolean;
    emailNotification: boolean;
}

const mockBackups: BackupJob[] = [
    {
        id: "1",
        name: "Backup Completo - Janeiro 2024",
        type: "scheduled",
        status: "completed",
        createdAt: new Date("2024-01-15T02:00:00"),
        completedAt: new Date("2024-01-15T02:15:00"),
        size: 15728640, // 15MB
        format: "sql",
        includes: ["users", "transactions", "reports", "files"],
    },
    {
        id: "2",
        name: "Backup Financeiro - Semana 2",
        type: "manual",
        status: "completed",
        createdAt: new Date("2024-01-14T10:30:00"),
        completedAt: new Date("2024-01-14T10:35:00"),
        size: 5242880, // 5MB
        format: "json",
        includes: ["transactions", "reports"],
    },
    {
        id: "3",
        name: "Backup Automático - Diário",
        type: "scheduled",
        status: "running",
        createdAt: new Date("2024-01-15T03:00:00"),
        size: 0,
        format: "sql",
        includes: ["users", "transactions", "reports"],
    },
    {
        id: "4",
        name: "Backup de Usuários",
        type: "manual",
        status: "failed",
        createdAt: new Date("2024-01-13T14:20:00"),
        size: 0,
        format: "csv",
        includes: ["users"],
    },
];

const defaultSettings: BackupSettings = {
    autoBackup: true,
    frequency: "daily",
    retentionDays: 30,
    includeFiles: true,
    includeUsers: true,
    includeTransactions: true,
    includeReports: true,
    cloudStorage: false,
    emailNotification: true,
};

export default function BackupPage() {
    const [backups, setBackups] = useState<BackupJob[]>(mockBackups);
    const [settings, setSettings] = useState<BackupSettings>(defaultSettings);
    const [isCreatingBackup, setIsCreatingBackup] = useState(false);
    const [isSavingSettings, setIsSavingSettings] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed": return <CheckCircle size={16} />;
            case "running": return <RefreshCw size={16} />;
            case "failed": return <AlertTriangle size={16} />;
            case "pending": return <Clock size={16} />;
            default: return <Clock size={16} />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed": return "var(--color-success-500)";
            case "running": return "var(--color-primary-500)";
            case "failed": return "var(--color-error-500)";
            case "pending": return "var(--color-warning-500)";
            default: return "var(--color-neutrals-500)";
        }
    };

    const getFormatIcon = (format: string) => {
        switch (format) {
            case "sql": return <Database size={16} />;
            case "json": return <FileText size={16} />;
            case "csv": return <FileText size={16} />;
            default: return <FileText size={16} />;
        }
    };

    const getIncludeIcon = (include: string) => {
        switch (include) {
            case "users": return <Users size={14} />;
            case "transactions": return <DollarSign size={14} />;
            case "reports": return <FileText size={14} />;
            case "files": return <HardDrive size={14} />;
            default: return <FileText size={14} />;
        }
    };

    const handleCreateBackup = async () => {
        setIsCreatingBackup(true);

        const newBackup: BackupJob = {
            id: Date.now().toString(),
            name: `Backup Manual - ${new Date().toLocaleDateString('pt-BR')}`,
            type: "manual",
            status: "running",
            createdAt: new Date(),
            size: 0,
            format: "sql",
            includes: ["users", "transactions", "reports"],
        };

        setBackups(prev => [newBackup, ...prev]);

        // Simulate backup process
        setTimeout(() => {
            setBackups(prev =>
                prev.map(backup =>
                    backup.id === newBackup.id
                        ? {
                            ...backup,
                            status: "completed" as const,
                            completedAt: new Date(),
                            size: Math.floor(Math.random() * 20000000) + 1000000, // 1-20MB
                        }
                        : backup
                )
            );
            setIsCreatingBackup(false);
        }, 3000);
    };

    const handleDownloadBackup = (backup: BackupJob) => {
        // Simulate download
        const link = document.createElement("a");
        link.href = "#";
        link.download = `${backup.name}.${backup.format}`;
        link.click();
    };

    const handleDeleteBackup = (backupId: string) => {
        if (confirm("Tem certeza que deseja excluir este backup?")) {
            setBackups(prev => prev.filter(backup => backup.id !== backupId));
        }
    };

    const handleSaveSettings = async () => {
        setIsSavingSettings(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        setIsSavingSettings(false);
        setShowSettings(false);

        alert("Configurações salvas com sucesso!");
    };

    const handleSettingChange = (key: keyof BackupSettings, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const totalBackups = backups.length;
    const completedBackups = backups.filter(b => b.status === "completed").length;
    const totalSize = backups.reduce((acc, backup) => acc + backup.size, 0);
    const lastBackup = backups.find(b => b.status === "completed");

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <h1>Backup de Dados</h1>
                    <p>Gerencie backups automáticos e manuais dos dados da igreja</p>
                </div>
                <div className={styles.headerActions}>
                    <Button
                        variant="secondary"
                        onClick={() => setShowSettings(!showSettings)}
                        icon={<Settings size={20} />}
                    >
                        Configurações
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleCreateBackup}
                        disabled={isCreatingBackup}
                        loading={isCreatingBackup}
                        icon={<Download size={20} />}
                    >
                        Criar Backup
                    </Button>
                </div>
            </div>

            <div className={styles.stats}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <Database size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>{totalBackups}</h3>
                        <p>Total de Backups</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <CheckCircle size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>{completedBackups}</h3>
                        <p>Concluídos</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <HardDrive size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>{formatFileSize(totalSize)}</h3>
                        <p>Espaço Total</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <Clock size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>{lastBackup ? formatDate(lastBackup.completedAt!) : "N/A"}</h3>
                        <p>Último Backup</p>
                    </div>
                </div>
            </div>

            {showSettings && (
                <div className={styles.settingsCard}>
                    <h3>Configurações de Backup</h3>
                    <div className={styles.settingsGrid}>
                        <div className={styles.settingGroup}>
                            <label className={styles.settingLabel}>
                                Backup Automático
                            </label>
                            <Switch
                                checked={settings.autoBackup}
                                onChange={(checked) => handleSettingChange('autoBackup', checked)}
                            />
                        </div>

                        <div className={styles.settingGroup}>
                            <label className={styles.settingLabel}>
                                Frequência
                            </label>
                            <select
                                value={settings.frequency}
                                onChange={(e) => handleSettingChange('frequency', e.target.value)}
                                className={styles.select}
                                disabled={!settings.autoBackup}
                            >
                                <option value="daily">Diário</option>
                                <option value="weekly">Semanal</option>
                                <option value="monthly">Mensal</option>
                            </select>
                        </div>

                        <div className={styles.settingGroup}>
                            <label className={styles.settingLabel}>
                                Retenção (dias)
                            </label>
                            <Input
                                type="number"
                                value={settings.retentionDays}
                                onChange={(e) => handleSettingChange('retentionDays', Number(e.target.value))}
                                min="1"
                                max="365"
                            />
                        </div>

                        <div className={styles.settingGroup}>
                            <label className={styles.settingLabel}>
                                Armazenamento em Nuvem
                            </label>
                            <Switch
                                checked={settings.cloudStorage}
                                onChange={(checked) => handleSettingChange('cloudStorage', checked)}
                            />
                        </div>

                        <div className={styles.settingGroup}>
                            <label className={styles.settingLabel}>
                                Notificação por Email
                            </label>
                            <Switch
                                checked={settings.emailNotification}
                                onChange={(checked) => handleSettingChange('emailNotification', checked)}
                            />
                        </div>
                    </div>

                    <div className={styles.includesSection}>
                        <h4>Incluir nos Backups</h4>
                        <div className={styles.includesGrid}>
                            <label className={styles.includeOption}>
                                <Switch
                                    checked={settings.includeUsers}
                                    onChange={(checked) => handleSettingChange('includeUsers', checked)}
                                />
                                <Users size={16} />
                                <span>Usuários</span>
                            </label>
                            <label className={styles.includeOption}>
                                <Switch
                                    checked={settings.includeTransactions}
                                    onChange={(checked) => handleSettingChange('includeTransactions', checked)}
                                />
                                <DollarSign size={16} />
                                <span>Transações</span>
                            </label>
                            <label className={styles.includeOption}>
                                <Switch
                                    checked={settings.includeReports}
                                    onChange={(checked) => handleSettingChange('includeReports', checked)}
                                />
                                <FileText size={16} />
                                <span>Relatórios</span>
                            </label>
                            <label className={styles.includeOption}>
                                <Switch
                                    checked={settings.includeFiles}
                                    onChange={(checked) => handleSettingChange('includeFiles', checked)}
                                />
                                <HardDrive size={16} />
                                <span>Arquivos</span>
                            </label>
                        </div>
                    </div>

                    <div className={styles.settingsActions}>
                        <Button
                            variant="secondary"
                            onClick={() => setShowSettings(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSaveSettings}
                            loading={isSavingSettings}
                        >
                            Salvar Configurações
                        </Button>
                    </div>
                </div>
            )}

            <div className={styles.backupsList}>
                <h3>Histórico de Backups</h3>
                {backups.length === 0 ? (
                    <div className={styles.emptyState}>
                        <Database size={48} />
                        <h3>Nenhum backup encontrado</h3>
                        <p>Crie seu primeiro backup para proteger os dados da igreja</p>
                    </div>
                ) : (
                    <div className={styles.backupsGrid}>
                        {backups.map(backup => (
                            <div key={backup.id} className={styles.backupCard}>
                                <div className={styles.backupHeader}>
                                    <div className={styles.backupInfo}>
                                        <div className={styles.backupIcon}>
                                            {getFormatIcon(backup.format)}
                                        </div>
                                        <div className={styles.backupDetails}>
                                            <h4>{backup.name}</h4>
                                            <p>
                                                {backup.type === "manual" ? "Manual" : "Automático"} • {backup.format.toUpperCase()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={styles.backupStatus}>
                                        <div
                                            className={styles.statusBadge}
                                            style={{ color: getStatusColor(backup.status) }}
                                        >
                                            {getStatusIcon(backup.status)}
                                            <span>{backup.status}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.backupMeta}>
                                    <div className={styles.metaItem}>
                                        <Calendar size={14} />
                                        <span>{formatDate(backup.createdAt)}</span>
                                    </div>
                                    {backup.completedAt && (
                                        <div className={styles.metaItem}>
                                            <Clock size={14} />
                                            <span>Concluído em {formatDate(backup.completedAt)}</span>
                                        </div>
                                    )}
                                    <div className={styles.metaItem}>
                                        <HardDrive size={14} />
                                        <span>{formatFileSize(backup.size)}</span>
                                    </div>
                                </div>

                                <div className={styles.backupIncludes}>
                                    <h5>Inclui:</h5>
                                    <div className={styles.includesList}>
                                        {backup.includes.map(include => (
                                            <div key={include} className={styles.includeItem}>
                                                {getIncludeIcon(include)}
                                                <span>{include}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.backupActions}>
                                    {backup.status === "completed" && (
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => handleDownloadBackup(backup)}
                                            icon={<Download size={16} />}
                                        >
                                            Download
                                        </Button>
                                    )}
                                    {backup.status === "failed" && (
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => handleCreateBackup()}
                                            icon={<RefreshCw size={16} />}
                                        >
                                            Tentar Novamente
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteBackup(backup.id)}
                                    >
                                        Excluir
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
