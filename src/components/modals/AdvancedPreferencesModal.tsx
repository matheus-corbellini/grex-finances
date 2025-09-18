"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Switch } from "../ui/Switch";
import {
    Settings,
    Globe,
    Bell,
    Shield,
    Database,
    Palette,
    Clock,
    DollarSign,
    Eye,
    Lock
} from "lucide-react";
import styles from "./AdvancedPreferencesModal.module.css";

export interface AdvancedPreferences {
    // General Settings
    language: string;
    timezone: string;
    dateFormat: string;
    currency: string;
    currencyPosition: "before" | "after";

    // Display Settings
    theme: "light" | "dark" | "auto";
    compactMode: boolean;
    showAnimations: boolean;
    showTooltips: boolean;

    // Privacy & Security
    autoLogout: boolean;
    autoLogoutMinutes: number;
    requirePasswordChange: boolean;
    passwordChangeDays: number;
    twoFactorAuth: boolean;

    // Notifications
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    budgetAlerts: boolean;
    billReminders: boolean;
    investmentAlerts: boolean;

    // Data & Backup
    autoBackup: boolean;
    backupFrequency: "daily" | "weekly" | "monthly";
    dataRetentionDays: number;
    exportFormat: "csv" | "xlsx" | "pdf";

    // Advanced Features
    enableAnalytics: boolean;
    enableBetaFeatures: boolean;
    debugMode: boolean;
    apiAccess: boolean;
}

export interface AdvancedPreferencesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (preferences: AdvancedPreferences) => void;
    initialPreferences?: Partial<AdvancedPreferences>;
    isLoading?: boolean;
}

const defaultPreferences: AdvancedPreferences = {
    language: "pt-BR",
    timezone: "America/Sao_Paulo",
    dateFormat: "DD/MM/YYYY",
    currency: "BRL",
    currencyPosition: "before",
    theme: "auto",
    compactMode: false,
    showAnimations: true,
    showTooltips: true,
    autoLogout: false,
    autoLogoutMinutes: 30,
    requirePasswordChange: false,
    passwordChangeDays: 90,
    twoFactorAuth: false,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    budgetAlerts: true,
    billReminders: true,
    investmentAlerts: true,
    autoBackup: true,
    backupFrequency: "weekly",
    dataRetentionDays: 365,
    exportFormat: "csv",
    enableAnalytics: true,
    enableBetaFeatures: false,
    debugMode: false,
    apiAccess: false
};

export const AdvancedPreferencesModal: React.FC<AdvancedPreferencesModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialPreferences = {},
    isLoading = false
}) => {
    const [preferences, setPreferences] = useState<AdvancedPreferences>({
        ...defaultPreferences,
        ...initialPreferences
    });

    const [activeTab, setActiveTab] = useState<"general" | "display" | "privacy" | "notifications" | "data" | "advanced">("general");

    const handlePreferenceChange = (key: keyof AdvancedPreferences, value: any) => {
        setPreferences(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        onSave(preferences);
    };

    const handleClose = () => {
        setPreferences({ ...defaultPreferences, ...initialPreferences });
        setActiveTab("general");
        onClose();
    };

    const tabs = [
        { id: "general", label: "Geral", icon: Settings },
        { id: "display", label: "Exibição", icon: Eye },
        { id: "privacy", label: "Privacidade", icon: Shield },
        { id: "notifications", label: "Notificações", icon: Bell },
        { id: "data", label: "Dados", icon: Database },
        { id: "advanced", label: "Avançado", icon: Settings }
    ] as const;

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Preferências Avançadas" size="large">
            <div className={styles.container}>
                {/* Tab Navigation */}
                <div className={styles.tabNavigation}>
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <Icon size={16} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className={styles.tabContent}>
                    {activeTab === "general" && (
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>
                                <Globe size={20} />
                                Configurações Gerais
                            </h3>

                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Idioma</label>
                                    <Select
                                        value={preferences.language}
                                        onChange={(value) => handlePreferenceChange("language", value)}
                                    >
                                        <option value="pt-BR">Português (Brasil)</option>
                                        <option value="en-US">English (US)</option>
                                        <option value="es-ES">Español</option>
                                    </Select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Fuso Horário</label>
                                    <Select
                                        value={preferences.timezone}
                                        onChange={(value) => handlePreferenceChange("timezone", value)}
                                    >
                                        <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                                        <option value="America/New_York">Nova York (GMT-5)</option>
                                        <option value="Europe/London">Londres (GMT+0)</option>
                                        <option value="Asia/Tokyo">Tóquio (GMT+9)</option>
                                    </Select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Formato de Data</label>
                                    <Select
                                        value={preferences.dateFormat}
                                        onChange={(value) => handlePreferenceChange("dateFormat", value)}
                                    >
                                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                    </Select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Moeda</label>
                                    <Select
                                        value={preferences.currency}
                                        onChange={(value) => handlePreferenceChange("currency", value)}
                                    >
                                        <option value="BRL">Real Brasileiro (R$)</option>
                                        <option value="USD">Dólar Americano ($)</option>
                                        <option value="EUR">Euro (€)</option>
                                        <option value="GBP">Libra Esterlina (£)</option>
                                    </Select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Posição da Moeda</label>
                                    <Select
                                        value={preferences.currencyPosition}
                                        onChange={(value) => handlePreferenceChange("currencyPosition", value)}
                                    >
                                        <option value="before">Antes (R$ 100)</option>
                                        <option value="after">Depois (100 R$)</option>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "display" && (
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>
                                <Palette size={20} />
                                Configurações de Exibição
                            </h3>

                            <div className={styles.switchGroup}>
                                <div className={styles.switchItem}>
                                    <div className={styles.switchInfo}>
                                        <label className={styles.switchLabel}>Tema</label>
                                        <span className={styles.switchDescription}>Escolha entre tema claro, escuro ou automático</span>
                                    </div>
                                    <Select
                                        value={preferences.theme}
                                        onChange={(value) => handlePreferenceChange("theme", value)}
                                        className={styles.switchSelect}
                                    >
                                        <option value="light">Claro</option>
                                        <option value="dark">Escuro</option>
                                        <option value="auto">Automático</option>
                                    </Select>
                                </div>

                                <div className={styles.switchItem}>
                                    <div className={styles.switchInfo}>
                                        <label className={styles.switchLabel}>Modo Compacto</label>
                                        <span className={styles.switchDescription}>Interface mais compacta para telas menores</span>
                                    </div>
                                    <Switch
                                        checked={preferences.compactMode}
                                        onChange={(checked) => handlePreferenceChange("compactMode", checked)}
                                    />
                                </div>

                                <div className={styles.switchItem}>
                                    <div className={styles.switchInfo}>
                                        <label className={styles.switchLabel}>Animações</label>
                                        <span className={styles.switchDescription}>Habilitar animações e transições</span>
                                    </div>
                                    <Switch
                                        checked={preferences.showAnimations}
                                        onChange={(checked) => handlePreferenceChange("showAnimations", checked)}
                                    />
                                </div>

                                <div className={styles.switchItem}>
                                    <div className={styles.switchInfo}>
                                        <label className={styles.switchLabel}>Dicas de Ferramentas</label>
                                        <span className={styles.switchDescription}>Mostrar dicas ao passar o mouse</span>
                                    </div>
                                    <Switch
                                        checked={preferences.showTooltips}
                                        onChange={(checked) => handlePreferenceChange("showTooltips", checked)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "privacy" && (
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>
                                <Shield size={20} />
                                Privacidade e Segurança
                            </h3>

                            <div className={styles.switchGroup}>
                                <div className={styles.switchItem}>
                                    <div className={styles.switchInfo}>
                                        <label className={styles.switchLabel}>Logout Automático</label>
                                        <span className={styles.switchDescription}>Fazer logout automaticamente após inatividade</span>
                                    </div>
                                    <Switch
                                        checked={preferences.autoLogout}
                                        onChange={(checked) => handlePreferenceChange("autoLogout", checked)}
                                    />
                                </div>

                                {preferences.autoLogout && (
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Minutos de Inatividade</label>
                                        <Input
                                            type="number"
                                            value={preferences.autoLogoutMinutes.toString()}
                                            onChange={(value) => handlePreferenceChange("autoLogoutMinutes", parseInt(value))}
                                        />
                                    </div>
                                )}

                                <div className={styles.switchItem}>
                                    <div className={styles.switchInfo}>
                                        <label className={styles.switchLabel}>Troca Obrigatória de Senha</label>
                                        <span className={styles.switchDescription}>Forçar troca de senha periodicamente</span>
                                    </div>
                                    <Switch
                                        checked={preferences.requirePasswordChange}
                                        onChange={(checked) => handlePreferenceChange("requirePasswordChange", checked)}
                                    />
                                </div>

                                {preferences.requirePasswordChange && (
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Dias para Troca de Senha</label>
                                        <Input
                                            type="number"
                                            value={preferences.passwordChangeDays.toString()}
                                            onChange={(value) => handlePreferenceChange("passwordChangeDays", parseInt(value))}
                                        />
                                    </div>
                                )}

                                <div className={styles.switchItem}>
                                    <div className={styles.switchInfo}>
                                        <label className={styles.switchLabel}>Autenticação de Dois Fatores</label>
                                        <span className={styles.switchDescription}>Adicionar camada extra de segurança</span>
                                    </div>
                                    <Switch
                                        checked={preferences.twoFactorAuth}
                                        onChange={(checked) => handlePreferenceChange("twoFactorAuth", checked)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "notifications" && (
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>
                                <Bell size={20} />
                                Configurações de Notificações
                            </h3>

                            <div className={styles.switchGroup}>
                                <div className={styles.switchItem}>
                                    <div className={styles.switchInfo}>
                                        <label className={styles.switchLabel}>Notificações por Email</label>
                                        <span className={styles.switchDescription}>Receber notificações importantes por email</span>
                                    </div>
                                    <Switch
                                        checked={preferences.emailNotifications}
                                        onChange={(checked) => handlePreferenceChange("emailNotifications", checked)}
                                    />
                                </div>

                                <div className={styles.switchItem}>
                                    <div className={styles.switchInfo}>
                                        <label className={styles.switchLabel}>Notificações Push</label>
                                        <span className={styles.switchDescription}>Receber notificações no navegador</span>
                                    </div>
                                    <Switch
                                        checked={preferences.pushNotifications}
                                        onChange={(checked) => handlePreferenceChange("pushNotifications", checked)}
                                    />
                                </div>

                                <div className={styles.switchItem}>
                                    <div className={styles.switchInfo}>
                                        <label className={styles.switchLabel}>Notificações SMS</label>
                                        <span className={styles.switchDescription}>Receber notificações por SMS</span>
                                    </div>
                                    <Switch
                                        checked={preferences.smsNotifications}
                                        onChange={(checked) => handlePreferenceChange("smsNotifications", checked)}
                                    />
                                </div>

                                <div className={styles.switchItem}>
                                    <div className={styles.switchInfo}>
                                        <label className={styles.switchLabel}>Alertas de Orçamento</label>
                                        <span className={styles.switchDescription}>Notificar quando ultrapassar limites de orçamento</span>
                                    </div>
                                    <Switch
                                        checked={preferences.budgetAlerts}
                                        onChange={(checked) => handlePreferenceChange("budgetAlerts", checked)}
                                    />
                                </div>

                                <div className={styles.switchItem}>
                                    <div className={styles.switchInfo}>
                                        <label className={styles.switchLabel}>Lembretes de Contas</label>
                                        <span className={styles.switchDescription}>Notificar sobre contas próximas do vencimento</span>
                                    </div>
                                    <Switch
                                        checked={preferences.billReminders}
                                        onChange={(checked) => handlePreferenceChange("billReminders", checked)}
                                    />
                                </div>

                                <div className={styles.switchItem}>
                                    <div className={styles.switchInfo}>
                                        <label className={styles.switchLabel}>Alertas de Investimentos</label>
                                        <span className={styles.switchDescription}>Notificar sobre mudanças significativas nos investimentos</span>
                                    </div>
                                    <Switch
                                        checked={preferences.investmentAlerts}
                                        onChange={(checked) => handlePreferenceChange("investmentAlerts", checked)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "data" && (
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>
                                <Database size={20} />
                                Dados e Backup
                            </h3>

                            <div className={styles.switchGroup}>
                                <div className={styles.switchItem}>
                                    <div className={styles.switchInfo}>
                                        <label className={styles.switchLabel}>Backup Automático</label>
                                        <span className={styles.switchDescription}>Fazer backup automático dos dados</span>
                                    </div>
                                    <Switch
                                        checked={preferences.autoBackup}
                                        onChange={(checked) => handlePreferenceChange("autoBackup", checked)}
                                    />
                                </div>

                                {preferences.autoBackup && (
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Frequência do Backup</label>
                                        <Select
                                            value={preferences.backupFrequency}
                                            onChange={(value) => handlePreferenceChange("backupFrequency", value)}
                                        >
                                            <option value="daily">Diário</option>
                                            <option value="weekly">Semanal</option>
                                            <option value="monthly">Mensal</option>
                                        </Select>
                                    </div>
                                )}

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Retenção de Dados (dias)</label>
                                    <Input
                                        type="number"
                                        value={preferences.dataRetentionDays.toString()}
                                        onChange={(value) => handlePreferenceChange("dataRetentionDays", parseInt(value))}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Formato de Exportação</label>
                                    <Select
                                        value={preferences.exportFormat}
                                        onChange={(value) => handlePreferenceChange("exportFormat", value)}
                                    >
                                        <option value="csv">CSV</option>
                                        <option value="xlsx">Excel (XLSX)</option>
                                        <option value="pdf">PDF</option>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "advanced" && (
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>
                                <Settings size={20} />
                                Configurações Avançadas
                            </h3>

                            <div className={styles.switchGroup}>
                                <div className={styles.switchItem}>
                                    <div className={styles.switchInfo}>
                                        <label className={styles.switchLabel}>Analytics</label>
                                        <span className={styles.switchDescription}>Permitir coleta de dados de uso para melhorias</span>
                                    </div>
                                    <Switch
                                        checked={preferences.enableAnalytics}
                                        onChange={(checked) => handlePreferenceChange("enableAnalytics", checked)}
                                    />
                                </div>

                                <div className={styles.switchItem}>
                                    <div className={styles.switchInfo}>
                                        <label className={styles.switchLabel}>Recursos Beta</label>
                                        <span className={styles.switchDescription}>Habilitar recursos experimentais</span>
                                    </div>
                                    <Switch
                                        checked={preferences.enableBetaFeatures}
                                        onChange={(checked) => handlePreferenceChange("enableBetaFeatures", checked)}
                                    />
                                </div>

                                <div className={styles.switchItem}>
                                    <div className={styles.switchInfo}>
                                        <label className={styles.switchLabel}>Modo Debug</label>
                                        <span className={styles.switchDescription}>Mostrar informações de debug no console</span>
                                    </div>
                                    <Switch
                                        checked={preferences.debugMode}
                                        onChange={(checked) => handlePreferenceChange("debugMode", checked)}
                                    />
                                </div>

                                <div className={styles.switchItem}>
                                    <div className={styles.switchInfo}>
                                        <label className={styles.switchLabel}>Acesso à API</label>
                                        <span className={styles.switchDescription}>Permitir acesso programático aos dados</span>
                                    </div>
                                    <Switch
                                        checked={preferences.apiAccess}
                                        onChange={(checked) => handlePreferenceChange("apiAccess", checked)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <Button
                        variant="secondary"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        loading={isLoading}
                    >
                        Salvar Preferências
                    </Button>
                </div>
            </div>
        </Modal >
    );
};
