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
    const [activeSection, setActiveSection] = useState("usuarios");
    const [showUpgradeBanner, setShowUpgradeBanner] = useState(true);

    const settingsMenu = [
        { id: "minha-igreja", label: "Minha Igreja", icon: Building },
        { id: "preferencias", label: "Preferências", icon: SettingsIcon },
        { id: "usuarios", label: "Usuários", icon: Users },
        { id: "meu-plano", label: "Meu plano", icon: CreditCard },
        { id: "categorias", label: "Categorias", icon: Tag }
    ];

    const renderContent = () => {
        switch (activeSection) {
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

                    <div className={styles.sidebarFooter}>
                        <div className={styles.footerSection}>
                            <button className={styles.footerItem}>
                                <SettingsIcon size={16} />
                                <span>Configurações</span>
                            </button>
                            <button className={styles.footerItem}>
                                <HelpCircle size={16} />
                                <span>Ajuda</span>
                            </button>
                        </div>

                        <div className={styles.footerLinks}>
                            <a href="/dashboard/privacy">Política de Privacidade</a>
                            <a href="#">Abrir Ticket de Suporte</a>
                            <a href="/dashboard/terms">Termos de Uso</a>
                        </div>

                        <button className={styles.logoutButton}>
                            <LogOut size={16} />
                            <span>Sair</span>
                        </button>
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
