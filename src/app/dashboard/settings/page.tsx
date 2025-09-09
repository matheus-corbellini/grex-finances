"use client";

import React, { useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import {
    Building,
    Users,
    CreditCard,
    Tag,
    Settings as SettingsIcon,
    HelpCircle,
    LogOut,
    Bell,
    ChevronDown,
    X,
    Plus
} from "lucide-react";
import styles from "./Settings.module.css";

// Mock data
const mockUsers = [
    {
        id: 1,
        name: "Gustavo Bertin",
        email: "gustavo@grex.com.br",
        role: "Dono da conta",
        initials: "GB"
    }
];

export default function Settings() {
    const [activeSection, setActiveSection] = useState("preferencias");
    const [showUpgradeBanner, setShowUpgradeBanner] = useState(true);

    // Preferências state
    const [preferences, setPreferences] = useState({
        orderType: "crescente",
        defaultPeriod: "mensal",
        defaultCurrency: "brl"
    });

    const settingsMenu = [
        { id: "minha-igreja", label: "Minha Igreja", icon: Building },
        { id: "preferencias", label: "Preferências", icon: SettingsIcon },
        { id: "usuarios", label: "Usuários", icon: Users },
        { id: "meu-plano", label: "Meu plano", icon: CreditCard },
        { id: "categorias", label: "Categorias", icon: Tag }
    ];

    const handlePreferenceChange = (key: string, value: string) => {
        setPreferences(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSavePreferences = () => {
        // Aqui você pode implementar a lógica para salvar as preferências
        console.log('Salvando preferências:', preferences);
        // Simular salvamento
        alert('Preferências salvas com sucesso!');
    };

    const renderContent = () => {
        switch (activeSection) {
            case "preferencias":
                return (
                    <div className={styles.preferencesSection}>
                        <div className={styles.preferencesCard}>
                            <h2 className={styles.preferencesTitle}>Preferências</h2>

                            <div className={styles.preferencesForm}>
                                {/* Ordem dos lançamentos */}
                                <div className={styles.formField}>
                                    <label className={styles.fieldLabel}>
                                        Ordem dos lançamentos na tela
                                    </label>
                                    <div className={styles.selectContainer}>
                                        <select
                                            className={styles.selectField}
                                            value={preferences.orderType}
                                            onChange={(e) => handlePreferenceChange('orderType', e.target.value)}
                                        >
                                            <option value="crescente">Crescente</option>
                                            <option value="decrescente">Decrescente</option>
                                        </select>
                                        <ChevronDown size={16} className={styles.selectIcon} />
                                    </div>
                                </div>

                                {/* Período de navegação */}
                                <div className={styles.formField}>
                                    <label className={styles.fieldLabel}>
                                        Período de navegação padrão
                                    </label>
                                    <div className={styles.selectContainer}>
                                        <select
                                            className={styles.selectField}
                                            value={preferences.defaultPeriod}
                                            onChange={(e) => handlePreferenceChange('defaultPeriod', e.target.value)}
                                        >
                                            <option value="mensal">Mensal</option>
                                            <option value="semanal">Semanal</option>
                                            <option value="anual">Anual</option>
                                        </select>
                                        <ChevronDown size={16} className={styles.selectIcon} />
                                    </div>
                                </div>

                                {/* Moeda padrão */}
                                <div className={styles.formField}>
                                    <label className={styles.fieldLabel}>
                                        Moeda padrão
                                    </label>
                                    <div className={styles.selectContainer}>
                                        <select
                                            className={styles.selectField}
                                            value={preferences.defaultCurrency}
                                            onChange={(e) => handlePreferenceChange('defaultCurrency', e.target.value)}
                                        >
                                            <option value="brl">(BRL) Real</option>
                                            <option value="usd">(USD) Dólar</option>
                                            <option value="eur">(EUR) Euro</option>
                                        </select>
                                        <ChevronDown size={16} className={styles.selectIcon} />
                                    </div>
                                </div>

                                {/* Botão Salvar */}
                                <button
                                    className={styles.saveButton}
                                    onClick={handleSavePreferences}
                                >
                                    Salvar
                                </button>

                                {/* Zona de perigo */}
                                <div className={styles.dangerZone}>
                                    <h3 className={styles.dangerTitle}>Excluir dados do sistema</h3>
                                    <p className={styles.dangerText}>
                                        Esta é uma zona de perigo! Você pode excluir os seus dados do sistema,
                                        mas entenda que ao fazer isso você não poderá voltar atrás!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case "usuarios":
                return (
                    <div className={styles.usersSection}>
                        {/* Header */}
                        <div className={styles.usersHeader}>
                            <div className={styles.usersCount}>
                                {mockUsers.length} usuário{mockUsers.length !== 1 ? 's' : ''}
                            </div>
                            <button className={styles.addButton}>
                                <Plus size={16} />
                                Adicionar
                            </button>
                        </div>

                        {/* Upgrade Banner */}
                        {showUpgradeBanner && (
                            <div className={styles.upgradeBanner}>
                                <span>Migre para o plano PLUS para adicionar usuários ilimitados.</span>
                                <button
                                    className={styles.closeBanner}
                                    onClick={() => setShowUpgradeBanner(false)}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}

                        {/* Users List */}
                        <div className={styles.usersList}>
                            {mockUsers.map((user) => (
                                <div key={user.id} className={styles.userCard}>
                                    <div className={styles.userAvatar}>
                                        {user.initials}
                                    </div>
                                    <div className={styles.userInfo}>
                                        <div className={styles.userName}>{user.name}</div>
                                        <div className={styles.userEmail}>{user.email}</div>
                                    </div>
                                    <div className={styles.userRole}>{user.role}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default:
                return (
                    <div className={styles.placeholderContent}>
                        <h2>Seção em desenvolvimento</h2>
                        <p>Esta seção será implementada em breve.</p>
                    </div>
                );
        }
    };

    return (
        <DashboardLayout>
            <div className={styles.settingsContainer}>
                {/* Sidebar */}
                <div className={styles.sidebar}>
                    <div className={styles.sidebarHeader}>
                        <h2>Configurações</h2>
                    </div>

                    <div className={styles.sidebarMenu}>
                        {settingsMenu.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    className={`${styles.sidebarItem} ${activeSection === item.id ? styles.active : ''
                                        }`}
                                    onClick={() => setActiveSection(item.id)}
                                >
                                    <Icon size={20} />
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </div>

                </div>

                {/* Main Content */}
                <div className={styles.mainContent}>
                    {renderContent()}
                </div>
            </div>
        </DashboardLayout>
    );
}
