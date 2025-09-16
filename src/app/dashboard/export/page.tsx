"use client";

import React, { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Switch } from "../../../components/ui/Switch";
import {
    Download,
    FileText,
    Calendar,
    Users,
    DollarSign,
    Database,
    Settings,
    CheckCircle,
    AlertTriangle,
    Clock,
    Filter,
    Search
} from "lucide-react";
import styles from "./Export.module.css";

interface ExportOption {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    enabled: boolean;
    size: number;
    format: "xlsx" | "csv" | "pdf" | "json";
}

interface ExportSettings {
    dateRange: {
        start: string;
        end: string;
    };
    includeHeaders: boolean;
    includeMetadata: boolean;
    format: "xlsx" | "csv" | "pdf" | "json";
    compression: boolean;
    password: string;
}

const exportOptions: ExportOption[] = [
    {
        id: "transactions",
        name: "Transações Financeiras",
        description: "Todas as transações de entrada e saída",
        icon: <DollarSign size={20} />,
        enabled: true,
        size: 1024000,
        format: "xlsx",
    },
    {
        id: "users",
        name: "Usuários e Membros",
        description: "Dados dos usuários e membros da igreja",
        icon: <Users size={20} />,
        enabled: true,
        size: 512000,
        format: "xlsx",
    },
    {
        id: "reports",
        name: "Relatórios",
        description: "Relatórios financeiros e estatísticos",
        icon: <FileText size={20} />,
        enabled: false,
        size: 2048000,
        format: "pdf",
    },
    {
        id: "categories",
        name: "Categorias",
        description: "Categorias de receitas e despesas",
        icon: <Database size={20} />,
        enabled: true,
        size: 256000,
        format: "json",
    },
    {
        id: "accounts",
        name: "Contas Bancárias",
        description: "Informações das contas e saldos",
        icon: <Database size={20} />,
        enabled: false,
        size: 128000,
        format: "xlsx",
    },
    {
        id: "events",
        name: "Eventos",
        description: "Calendário de eventos e atividades",
        icon: <Calendar size={20} />,
        enabled: false,
        size: 384000,
        format: "csv",
    },
];

export default function ExportPage() {
    const [options, setOptions] = useState<ExportOption[]>(exportOptions);
    const [settings, setSettings] = useState<ExportSettings>({
        dateRange: {
            start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
            end: new Date().toISOString().split('T')[0],
        },
        includeHeaders: true,
        includeMetadata: true,
        format: "xlsx",
        compression: false,
        password: "",
    });
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const getFormatIcon = (format: string) => {
        switch (format) {
            case "xlsx": return "📊";
            case "csv": return "📄";
            case "pdf": return "📋";
            case "json": return "🔧";
            default: return "📄";
        }
    };

    const getFormatLabel = (format: string) => {
        switch (format) {
            case "xlsx": return "Excel (XLSX)";
            case "csv": return "CSV";
            case "pdf": return "PDF";
            case "json": return "JSON";
            default: return format.toUpperCase();
        }
    };

    const handleToggleOption = (optionId: string) => {
        setOptions(prev =>
            prev.map(option =>
                option.id === optionId ? { ...option, enabled: !option.enabled } : option
            )
        );
    };

    const handleSelectAll = () => {
        const allEnabled = options.every(option => option.enabled);
        setOptions(prev =>
            prev.map(option => ({ ...option, enabled: !allEnabled }))
        );
    };

    const handleExport = async () => {
        const selectedOptions = options.filter(option => option.enabled);

        if (selectedOptions.length === 0) {
            alert("Selecione pelo menos uma opção para exportar.");
            return;
        }

        setIsExporting(true);
        setExportProgress(0);

        try {
            // Simulate export process
            const totalSteps = selectedOptions.length + 2; // +2 for preparation and finalization
            let currentStep = 0;

            const progressInterval = setInterval(() => {
                currentStep++;
                const progress = Math.floor((currentStep / totalSteps) * 100);
                setExportProgress(progress);

                if (currentStep >= totalSteps) {
                    clearInterval(progressInterval);
                    setTimeout(() => {
                        setIsExporting(false);
                        setExportProgress(0);
                        alert("Exportação concluída com sucesso!");
                    }, 500);
                }
            }, 1000);

        } catch (error) {
            console.error("Erro na exportação:", error);
            alert("Erro durante a exportação. Tente novamente.");
            setIsExporting(false);
            setExportProgress(0);
        }
    };

    const handleSettingChange = (key: keyof ExportSettings, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const selectedOptions = options.filter(option => option.enabled);
    const totalSize = selectedOptions.reduce((acc, option) => acc + option.size, 0);
    const allEnabled = options.every(option => option.enabled);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <h1>Exportação Completa</h1>
                    <p>Exporte todos os dados da igreja em diferentes formatos</p>
                </div>
                <div className={styles.headerActions}>
                    <Button
                        variant="secondary"
                        onClick={handleSelectAll}
                    >
                        {allEnabled ? "Desmarcar Todos" : "Selecionar Todos"}
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleExport}
                        disabled={selectedOptions.length === 0 || isExporting}
                        loading={isExporting}
                        icon={<Download size={20} />}
                    >
                        {isExporting ? "Exportando..." : "Exportar Dados"}
                    </Button>
                </div>
            </div>

            <div className={styles.summary}>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}>
                        <Database size={24} />
                    </div>
                    <div className={styles.summaryInfo}>
                        <h3>{selectedOptions.length} de {options.length}</h3>
                        <p>Opções Selecionadas</p>
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}>
                        <FileText size={24} />
                    </div>
                    <div className={styles.summaryInfo}>
                        <h3>{formatFileSize(totalSize)}</h3>
                        <p>Tamanho Estimado</p>
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}>
                        <Settings size={24} />
                    </div>
                    <div className={styles.summaryInfo}>
                        <h3>{getFormatLabel(settings.format)}</h3>
                        <p>Formato Principal</p>
                    </div>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.optionsSection}>
                    <h3>Dados para Exportar</h3>
                    <div className={styles.optionsList}>
                        {options.map(option => (
                            <div key={option.id} className={styles.optionCard}>
                                <div className={styles.optionHeader}>
                                    <div className={styles.optionInfo}>
                                        <div className={styles.optionIcon}>
                                            {option.icon}
                                        </div>
                                        <div className={styles.optionDetails}>
                                            <h4>{option.name}</h4>
                                            <p>{option.description}</p>
                                        </div>
                                    </div>
                                    <div className={styles.optionMeta}>
                                        <div className={styles.optionSize}>
                                            {formatFileSize(option.size)}
                                        </div>
                                        <div className={styles.optionFormat}>
                                            {getFormatIcon(option.format)} {option.format.toUpperCase()}
                                        </div>
                                        <Switch
                                            checked={option.enabled}
                                            onChange={() => handleToggleOption(option.id)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.settingsSection}>
                    <h3>Configurações de Exportação</h3>
                    <div className={styles.settingsGrid}>
                        <div className={styles.settingGroup}>
                            <label className={styles.settingLabel}>
                                Período de Dados
                            </label>
                            <div className={styles.dateRange}>
                                <Input
                                    type="date"
                                    value={settings.dateRange.start}
                                    onChange={(e) =>
                                        handleSettingChange('dateRange', {
                                            ...settings.dateRange,
                                            start: e.target.value
                                        })
                                    }
                                />
                                <span>até</span>
                                <Input
                                    type="date"
                                    value={settings.dateRange.end}
                                    onChange={(e) =>
                                        handleSettingChange('dateRange', {
                                            ...settings.dateRange,
                                            end: e.target.value
                                        })
                                    }
                                />
                            </div>
                        </div>

                        <div className={styles.settingGroup}>
                            <label className={styles.settingLabel}>
                                Formato Principal
                            </label>
                            <select
                                value={settings.format}
                                onChange={(e) => handleSettingChange('format', e.target.value)}
                                className={styles.select}
                            >
                                <option value="xlsx">Excel (XLSX)</option>
                                <option value="csv">CSV</option>
                                <option value="pdf">PDF</option>
                                <option value="json">JSON</option>
                            </select>
                        </div>

                        <div className={styles.settingGroup}>
                            <label className={styles.settingLabel}>
                                Incluir Cabeçalhos
                            </label>
                            <Switch
                                checked={settings.includeHeaders}
                                onChange={(checked) => handleSettingChange('includeHeaders', checked)}
                            />
                        </div>

                        <div className={styles.settingGroup}>
                            <label className={styles.settingLabel}>
                                Incluir Metadados
                            </label>
                            <Switch
                                checked={settings.includeMetadata}
                                onChange={(checked) => handleSettingChange('includeMetadata', checked)}
                            />
                        </div>

                        <div className={styles.settingGroup}>
                            <label className={styles.settingLabel}>
                                Comprimir Arquivo
                            </label>
                            <Switch
                                checked={settings.compression}
                                onChange={(checked) => handleSettingChange('compression', checked)}
                            />
                        </div>

                        <div className={styles.settingGroup}>
                            <label className={styles.settingLabel}>
                                Senha de Proteção (Opcional)
                            </label>
                            <Input
                                type="password"
                                value={settings.password}
                                onChange={(e) => handleSettingChange('password', e.target.value)}
                                placeholder="Digite uma senha para proteger o arquivo"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {isExporting && (
                <div className={styles.exportProgress}>
                    <div className={styles.progressHeader}>
                        <h3>Exportando Dados...</h3>
                        <span>{exportProgress}%</span>
                    </div>
                    <div className={styles.progressBar}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${exportProgress}%` }}
                        />
                    </div>
                    <p>Preparando arquivos para download...</p>
                </div>
            )}
        </div>
    );
}
