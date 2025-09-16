"use client";

import React, { useState } from "react";
import { DashboardLayout } from "../../../../components/layout";
import { useToastNotifications } from "../../../../hooks/useToastNotifications";
import {
    Bell,
    Mail,
    Smartphone,
    Settings,
    Save,
    RefreshCw,
    CheckCircle,
    AlertTriangle,
    Info,
    Clock,
    Users,
    CreditCard,
    FileText,
    Shield,
    Database
} from "lucide-react";
import styles from "./NotificationSettings.module.css";

export default function NotificationSettingsPage() {
    const toast = useToastNotifications();

    const [notificationSettings, setNotificationSettings] = useState({
        // Email notifications
        email: {
            enabled: true,
            transactions: true,
            reports: true,
            users: true,
            backups: true,
            security: true,
            weekly: true,
            monthly: true
        },
        // Push notifications
        push: {
            enabled: true,
            transactions: true,
            reports: false,
            users: true,
            backups: false,
            security: true,
            realTime: true
        },
        // SMS notifications
        sms: {
            enabled: false,
            transactions: false,
            reports: false,
            users: false,
            backups: false,
            security: true,
            emergency: true
        },
        // General settings
        general: {
            quietHours: {
                enabled: true,
                start: "22:00",
                end: "08:00"
            },
            frequency: "immediate",
            digest: "weekly",
            language: "pt-BR"
        }
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleSettingChange = (category: string, key: string, value: any) => {
        setNotificationSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category as keyof typeof prev],
                [key]: value
            }
        }));
    };

    const handleSaveSettings = async () => {
        setIsSaving(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.showSaveSuccess();
        } catch (error) {
            toast.showApiError("salvar configurações de notificação");
        } finally {
            setIsSaving(false);
        }
    };

    const handleTestNotification = (type: string) => {
        switch (type) {
            case "email":
                toast.showSuccess("Email de teste enviado!");
                break;
            case "push":
                toast.showInfo("Notificação push de teste enviada!");
                break;
            case "sms":
                toast.showWarning("SMS de teste enviado!");
                break;
        }
    };

    const notificationTypes = [
        {
            id: "transactions",
            name: "Transações",
            description: "Notificações sobre novas transações e alterações",
            icon: CreditCard,
            color: "#3b82f6"
        },
        {
            id: "reports",
            name: "Relatórios",
            description: "Relatórios automáticos e análises",
            icon: FileText,
            color: "#10b981"
        },
        {
            id: "users",
            name: "Usuários",
            description: "Atividades de usuários e convites",
            icon: Users,
            color: "#f59e0b"
        },
        {
            id: "backups",
            name: "Backups",
            description: "Status de backups e restaurações",
            icon: Database,
            color: "#8b5cf6"
        },
        {
            id: "security",
            name: "Segurança",
            description: "Alertas de segurança e login",
            icon: Shield,
            color: "#ef4444"
        }
    ];

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.titleSection}>
                        <Bell size={32} className={styles.titleIcon} />
                        <div>
                            <h1>Configurações de Notificações</h1>
                            <p>Gerencie como e quando você recebe notificações</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSaveSettings}
                        disabled={isSaving}
                        className={styles.saveButton}
                    >
                        {isSaving ? (
                            <>
                                <RefreshCw size={16} className="animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                Salvar Configurações
                            </>
                        )}
                    </button>
                </div>

                <div className={styles.content}>
                    {/* Email Notifications */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <Mail size={24} className={styles.sectionIcon} />
                            <div>
                                <h2>Notificações por Email</h2>
                                <p>Receba notificações importantes por email</p>
                            </div>
                            <div className={styles.toggleContainer}>
                                <input
                                    type="checkbox"
                                    checked={notificationSettings.email.enabled}
                                    onChange={(e) => handleSettingChange("email", "enabled", e.target.checked)}
                                    className={styles.toggle}
                                />
                                <button
                                    onClick={() => handleTestNotification("email")}
                                    className={styles.testButton}
                                >
                                    Testar
                                </button>
                            </div>
                        </div>

                        {notificationSettings.email.enabled && (
                            <div className={styles.notificationGrid}>
                                {notificationTypes.map(type => {
                                    const Icon = type.icon;
                                    return (
                                        <div key={type.id} className={styles.notificationItem}>
                                            <div className={styles.notificationHeader}>
                                                <div className={styles.notificationIcon} style={{ backgroundColor: type.color }}>
                                                    <Icon size={16} />
                                                </div>
                                                <div>
                                                    <h3>{type.name}</h3>
                                                    <p>{type.description}</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={notificationSettings.email[type.id as keyof typeof notificationSettings.email] as boolean}
                                                    onChange={(e) => handleSettingChange("email", type.id, e.target.checked)}
                                                    className={styles.checkbox}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Push Notifications */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <Smartphone size={24} className={styles.sectionIcon} />
                            <div>
                                <h2>Notificações Push</h2>
                                <p>Receba notificações instantâneas no navegador</p>
                            </div>
                            <div className={styles.toggleContainer}>
                                <input
                                    type="checkbox"
                                    checked={notificationSettings.push.enabled}
                                    onChange={(e) => handleSettingChange("push", "enabled", e.target.checked)}
                                    className={styles.toggle}
                                />
                                <button
                                    onClick={() => handleTestNotification("push")}
                                    className={styles.testButton}
                                >
                                    Testar
                                </button>
                            </div>
                        </div>

                        {notificationSettings.push.enabled && (
                            <div className={styles.notificationGrid}>
                                {notificationTypes.map(type => {
                                    const Icon = type.icon;
                                    return (
                                        <div key={type.id} className={styles.notificationItem}>
                                            <div className={styles.notificationHeader}>
                                                <div className={styles.notificationIcon} style={{ backgroundColor: type.color }}>
                                                    <Icon size={16} />
                                                </div>
                                                <div>
                                                    <h3>{type.name}</h3>
                                                    <p>{type.description}</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={notificationSettings.push[type.id as keyof typeof notificationSettings.push] as boolean}
                                                    onChange={(e) => handleSettingChange("push", type.id, e.target.checked)}
                                                    className={styles.checkbox}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* SMS Notifications */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <Smartphone size={24} className={styles.sectionIcon} />
                            <div>
                                <h2>Notificações por SMS</h2>
                                <p>Receba alertas críticos por SMS</p>
                            </div>
                            <div className={styles.toggleContainer}>
                                <input
                                    type="checkbox"
                                    checked={notificationSettings.sms.enabled}
                                    onChange={(e) => handleSettingChange("sms", "enabled", e.target.checked)}
                                    className={styles.toggle}
                                />
                                <button
                                    onClick={() => handleTestNotification("sms")}
                                    className={styles.testButton}
                                >
                                    Testar
                                </button>
                            </div>
                        </div>

                        {notificationSettings.sms.enabled && (
                            <div className={styles.notificationGrid}>
                                {notificationTypes.map(type => {
                                    const Icon = type.icon;
                                    return (
                                        <div key={type.id} className={styles.notificationItem}>
                                            <div className={styles.notificationHeader}>
                                                <div className={styles.notificationIcon} style={{ backgroundColor: type.color }}>
                                                    <Icon size={16} />
                                                </div>
                                                <div>
                                                    <h3>{type.name}</h3>
                                                    <p>{type.description}</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={notificationSettings.sms[type.id as keyof typeof notificationSettings.sms] as boolean}
                                                    onChange={(e) => handleSettingChange("sms", type.id, e.target.checked)}
                                                    className={styles.checkbox}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* General Settings */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <Settings size={24} className={styles.sectionIcon} />
                            <div>
                                <h2>Configurações Gerais</h2>
                                <p>Preferências gerais de notificação</p>
                            </div>
                        </div>

                        <div className={styles.generalSettings}>
                            <div className={styles.settingGroup}>
                                <label>Horário Silencioso</label>
                                <div className={styles.quietHours}>
                                    <input
                                        type="checkbox"
                                        checked={notificationSettings.general.quietHours.enabled}
                                        onChange={(e) => handleSettingChange("general", "quietHours", {
                                            ...notificationSettings.general.quietHours,
                                            enabled: e.target.checked
                                        })}
                                        className={styles.checkbox}
                                    />
                                    <span>Ativar horário silencioso</span>
                                </div>
                                {notificationSettings.general.quietHours.enabled && (
                                    <div className={styles.timeInputs}>
                                        <input
                                            type="time"
                                            value={notificationSettings.general.quietHours.start}
                                            onChange={(e) => handleSettingChange("general", "quietHours", {
                                                ...notificationSettings.general.quietHours,
                                                start: e.target.value
                                            })}
                                            className={styles.timeInput}
                                        />
                                        <span>até</span>
                                        <input
                                            type="time"
                                            value={notificationSettings.general.quietHours.end}
                                            onChange={(e) => handleSettingChange("general", "quietHours", {
                                                ...notificationSettings.general.quietHours,
                                                end: e.target.value
                                            })}
                                            className={styles.timeInput}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className={styles.settingGroup}>
                                <label>Frequência de Notificações</label>
                                <select
                                    value={notificationSettings.general.frequency}
                                    onChange={(e) => handleSettingChange("general", "frequency", e.target.value)}
                                    className={styles.select}
                                >
                                    <option value="immediate">Imediata</option>
                                    <option value="hourly">Por hora</option>
                                    <option value="daily">Diária</option>
                                </select>
                            </div>

                            <div className={styles.settingGroup}>
                                <label>Resumo</label>
                                <select
                                    value={notificationSettings.general.digest}
                                    onChange={(e) => handleSettingChange("general", "digest", e.target.value)}
                                    className={styles.select}
                                >
                                    <option value="daily">Diário</option>
                                    <option value="weekly">Semanal</option>
                                    <option value="monthly">Mensal</option>
                                    <option value="none">Nenhum</option>
                                </select>
                            </div>

                            <div className={styles.settingGroup}>
                                <label>Idioma</label>
                                <select
                                    value={notificationSettings.general.language}
                                    onChange={(e) => handleSettingChange("general", "language", e.target.value)}
                                    className={styles.select}
                                >
                                    <option value="pt-BR">Português (Brasil)</option>
                                    <option value="en-US">English (US)</option>
                                    <option value="es-ES">Español</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}