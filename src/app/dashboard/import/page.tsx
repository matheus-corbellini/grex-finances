"use client";

import React, { useState, useRef } from "react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Switch } from "../../../components/ui/Switch";
import {
    Upload,
    FileText,
    AlertTriangle,
    CheckCircle,
    Clock,
    Database,
    Users,
    DollarSign,
    Calendar,
    Settings,
    Download,
    Trash2,
    Eye,
    RefreshCw
} from "lucide-react";
import styles from "./Import.module.css";

interface ImportFile {
    id: string;
    name: string;
    size: number;
    type: string;
    status: "pending" | "processing" | "completed" | "error";
    progress: number;
    errors: string[];
    warnings: string[];
    records: {
        total: number;
        imported: number;
        skipped: number;
        failed: number;
    };
    uploadedAt: Date;
}

interface ImportSettings {
    skipDuplicates: boolean;
    updateExisting: boolean;
    validateData: boolean;
    createMissingCategories: boolean;
    defaultCategory: string;
    dateFormat: string;
    encoding: string;
}

const supportedFormats = [
    { extension: "xlsx", name: "Excel (XLSX)", icon: "📊" },
    { extension: "csv", name: "CSV", icon: "📄" },
    { extension: "json", name: "JSON", icon: "🔧" },
];

const defaultSettings: ImportSettings = {
    skipDuplicates: true,
    updateExisting: false,
    validateData: true,
    createMissingCategories: true,
    defaultCategory: "Outros",
    dateFormat: "DD/MM/YYYY",
    encoding: "UTF-8",
};

export default function ImportPage() {
    const [files, setFiles] = useState<ImportFile[]>([]);
    const [settings, setSettings] = useState<ImportSettings>(defaultSettings);
    const [isImporting, setIsImporting] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
            case "processing": return <RefreshCw size={16} />;
            case "error": return <AlertTriangle size={16} />;
            case "pending": return <Clock size={16} />;
            default: return <Clock size={16} />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed": return "var(--color-success-500)";
            case "processing": return "var(--color-primary-500)";
            case "error": return "var(--color-error-500)";
            case "pending": return "var(--color-warning-500)";
            default: return "var(--color-neutrals-500)";
        }
    };

    const getFileIcon = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        switch (extension) {
            case "xlsx": return "📊";
            case "csv": return "📄";
            case "json": return "🔧";
            default: return "📄";
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (!selectedFiles) return;

        Array.from(selectedFiles).forEach(file => {
            // Validate file type
            const extension = file.name.split('.').pop()?.toLowerCase();
            if (!supportedFormats.some(format => format.extension === extension)) {
                alert(`Formato não suportado: ${extension}. Formatos aceitos: XLSX, CSV, JSON`);
                return;
            }

            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert(`Arquivo muito grande: ${file.name}. Tamanho máximo: 10MB`);
                return;
            }

            const newFile: ImportFile = {
                id: Date.now().toString() + Math.random(),
                name: file.name,
                size: file.size,
                type: file.type,
                status: "pending",
                progress: 0,
                errors: [],
                warnings: [],
                records: {
                    total: 0,
                    imported: 0,
                    skipped: 0,
                    failed: 0,
                },
                uploadedAt: new Date(),
            };

            setFiles(prev => [...prev, newFile]);
        });

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleImport = async (fileId: string) => {
        setFiles(prev =>
            prev.map(file =>
                file.id === fileId ? { ...file, status: "processing" as const } : file
            )
        );

        // Simulate import process
        const progressInterval = setInterval(() => {
            setFiles(prev =>
                prev.map(file => {
                    if (file.id === fileId) {
                        const newProgress = Math.min(file.progress + Math.random() * 20, 100);
                        const newStatus = newProgress >= 100 ? "completed" : "processing";

                        if (newStatus === "completed") {
                            clearInterval(progressInterval);
                            return {
                                ...file,
                                progress: 100,
                                status: "completed" as const,
                                records: {
                                    total: Math.floor(Math.random() * 1000) + 100,
                                    imported: Math.floor(Math.random() * 800) + 50,
                                    skipped: Math.floor(Math.random() * 50),
                                    failed: Math.floor(Math.random() * 20),
                                },
                            };
                        }

                        return { ...file, progress: newProgress };
                    }
                    return file;
                })
            );
        }, 500);
    };

    const handleImportAll = async () => {
        const pendingFiles = files.filter(file => file.status === "pending");

        if (pendingFiles.length === 0) {
            alert("Nenhum arquivo pendente para importar.");
            return;
        }

        setIsImporting(true);

        for (const file of pendingFiles) {
            await handleImport(file.id);
            // Small delay between imports
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        setIsImporting(false);
    };

    const handleRemoveFile = (fileId: string) => {
        setFiles(prev => prev.filter(file => file.id !== fileId));
    };

    const handleClearAll = () => {
        if (confirm("Tem certeza que deseja remover todos os arquivos?")) {
            setFiles([]);
        }
    };

    const handleSettingChange = (key: keyof ImportSettings, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleDownloadTemplate = (format: string) => {
        // Simulate template download
        const link = document.createElement("a");
        link.href = "#";
        link.download = `template_importacao.${format}`;
        link.click();
    };

    const pendingFiles = files.filter(file => file.status === "pending").length;
    const completedFiles = files.filter(file => file.status === "completed").length;
    const totalRecords = files.reduce((acc, file) => acc + file.records.imported, 0);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <h1>Importação de Dados</h1>
                    <p>Importe dados de planilhas e arquivos para o sistema</p>
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
                        onClick={() => fileInputRef.current?.click()}
                        icon={<Upload size={20} />}
                    >
                        Selecionar Arquivos
                    </Button>
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".xlsx,.csv,.json"
                onChange={handleFileSelect}
                className={styles.fileInput}
            />

            <div className={styles.summary}>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}>
                        <FileText size={24} />
                    </div>
                    <div className={styles.summaryInfo}>
                        <h3>{files.length}</h3>
                        <p>Arquivos Selecionados</p>
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}>
                        <CheckCircle size={24} />
                    </div>
                    <div className={styles.summaryInfo}>
                        <h3>{completedFiles}</h3>
                        <p>Importados</p>
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}>
                        <Database size={24} />
                    </div>
                    <div className={styles.summaryInfo}>
                        <h3>{totalRecords}</h3>
                        <p>Registros Importados</p>
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}>
                        <Clock size={24} />
                    </div>
                    <div className={styles.summaryInfo}>
                        <h3>{pendingFiles}</h3>
                        <p>Pendentes</p>
                    </div>
                </div>
            </div>

            <div className={styles.templatesSection}>
                <h3>Templates de Importação</h3>
                <p>Baixe os templates para formatar seus dados corretamente</p>
                <div className={styles.templatesList}>
                    {supportedFormats.map(format => (
                        <div key={format.extension} className={styles.templateCard}>
                            <div className={styles.templateIcon}>{format.icon}</div>
                            <div className={styles.templateInfo}>
                                <h4>{format.name}</h4>
                                <p>Template para {format.extension.toUpperCase()}</p>
                            </div>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleDownloadTemplate(format.extension)}
                                icon={<Download size={16} />}
                            >
                                Baixar
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {showSettings && (
                <div className={styles.settingsCard}>
                    <h3>Configurações de Importação</h3>
                    <div className={styles.settingsGrid}>
                        <div className={styles.settingGroup}>
                            <label className={styles.settingLabel}>
                                Pular Duplicatas
                            </label>
                            <Switch
                                checked={settings.skipDuplicates}
                                onChange={(checked) => handleSettingChange('skipDuplicates', checked)}
                            />
                        </div>

                        <div className={styles.settingGroup}>
                            <label className={styles.settingLabel}>
                                Atualizar Registros Existentes
                            </label>
                            <Switch
                                checked={settings.updateExisting}
                                onChange={(checked) => handleSettingChange('updateExisting', checked)}
                            />
                        </div>

                        <div className={styles.settingGroup}>
                            <label className={styles.settingLabel}>
                                Validar Dados
                            </label>
                            <Switch
                                checked={settings.validateData}
                                onChange={(checked) => handleSettingChange('validateData', checked)}
                            />
                        </div>

                        <div className={styles.settingGroup}>
                            <label className={styles.settingLabel}>
                                Criar Categorias Ausentes
                            </label>
                            <Switch
                                checked={settings.createMissingCategories}
                                onChange={(checked) => handleSettingChange('createMissingCategories', checked)}
                            />
                        </div>

                        <div className={styles.settingGroup}>
                            <label className={styles.settingLabel}>
                                Categoria Padrão
                            </label>
                            <Input
                                value={settings.defaultCategory}
                                onChange={(value: string) => handleSettingChange('defaultCategory', value)}
                                placeholder="Nome da categoria padrão"
                            />
                        </div>

                        <div className={styles.settingGroup}>
                            <label className={styles.settingLabel}>
                                Formato de Data
                            </label>
                            <select
                                value={settings.dateFormat}
                                onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                                className={styles.select}
                            >
                                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                            </select>
                        </div>

                        <div className={styles.settingGroup}>
                            <label className={styles.settingLabel}>
                                Codificação
                            </label>
                            <select
                                value={settings.encoding}
                                onChange={(e) => handleSettingChange('encoding', e.target.value)}
                                className={styles.select}
                            >
                                <option value="UTF-8">UTF-8</option>
                                <option value="ISO-8859-1">ISO-8859-1</option>
                                <option value="Windows-1252">Windows-1252</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.filesSection}>
                <div className={styles.filesHeader}>
                    <h3>Arquivos para Importar</h3>
                    <div className={styles.filesActions}>
                        <Button
                            variant="secondary"
                            onClick={handleClearAll}
                            disabled={files.length === 0}
                        >
                            Limpar Todos
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleImportAll}
                            disabled={pendingFiles === 0 || isImporting}
                            loading={isImporting}
                        >
                            Importar Todos ({pendingFiles})
                        </Button>
                    </div>
                </div>

                {files.length === 0 ? (
                    <div className={styles.emptyState}>
                        <Upload size={48} />
                        <h3>Nenhum arquivo selecionado</h3>
                        <p>Selecione arquivos para importar ou baixe os templates</p>
                    </div>
                ) : (
                    <div className={styles.filesList}>
                        {files.map(file => (
                            <div key={file.id} className={styles.fileCard}>
                                <div className={styles.fileHeader}>
                                    <div className={styles.fileInfo}>
                                        <div className={styles.fileIcon}>
                                            {getFileIcon(file.name)}
                                        </div>
                                        <div className={styles.fileDetails}>
                                            <h4>{file.name}</h4>
                                            <p>{formatFileSize(file.size)} • {formatDate(file.uploadedAt)}</p>
                                        </div>
                                    </div>
                                    <div className={styles.fileStatus}>
                                        <div
                                            className={styles.statusBadge}
                                            style={{ color: getStatusColor(file.status) }}
                                        >
                                            {getStatusIcon(file.status)}
                                            <span>{file.status}</span>
                                        </div>
                                    </div>
                                </div>

                                {file.status === "processing" && (
                                    <div className={styles.progressSection}>
                                        <div className={styles.progressBar}>
                                            <div
                                                className={styles.progressFill}
                                                style={{ width: `${file.progress}%` }}
                                            />
                                        </div>
                                        <span className={styles.progressText}>{file.progress.toFixed(0)}%</span>
                                    </div>
                                )}

                                {file.status === "completed" && (
                                    <div className={styles.resultsSection}>
                                        <div className={styles.resultsGrid}>
                                            <div className={styles.resultItem}>
                                                <CheckCircle size={16} />
                                                <span>{file.records.imported} importados</span>
                                            </div>
                                            <div className={styles.resultItem}>
                                                <Clock size={16} />
                                                <span>{file.records.skipped} ignorados</span>
                                            </div>
                                            <div className={styles.resultItem}>
                                                <AlertTriangle size={16} />
                                                <span>{file.records.failed} falharam</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className={styles.fileActions}>
                                    {file.status === "pending" && (
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => handleImport(file.id)}
                                            icon={<Upload size={16} />}
                                        >
                                            Importar
                                        </Button>
                                    )}
                                    {file.status === "completed" && (
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            icon={<Eye size={16} />}
                                        >
                                            Ver Detalhes
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveFile(file.id)}
                                        icon={<Trash2 size={16} />}
                                    >
                                        Remover
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
