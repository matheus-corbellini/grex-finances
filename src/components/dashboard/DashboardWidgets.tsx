"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./DashboardWidgets.module.css";
import {
    CreditCard,
    TrendingUp,
    TrendingDown,
    Users,
    FileText,
    Settings,
    ArrowRight
} from "lucide-react";

export default function DashboardWidgets() {
    const router = useRouter();

    const quickActions = [
        {
            title: "Cartões",
            description: "Gerencie seus cartões de crédito",
            icon: CreditCard,
            path: "/dashboard/cards",
            color: "blue"
        },
        {
            title: "Transações",
            description: "Visualize suas transações",
            icon: TrendingUp,
            path: "/dashboard/transactions",
            color: "green"
        },
        {
            title: "Relatórios",
            description: "Acompanhe seus relatórios",
            icon: FileText,
            path: "/dashboard/reports",
            color: "purple"
        },
        {
            title: "Contatos",
            description: "Gerencie seus contatos",
            icon: Users,
            path: "/dashboard/contacts",
            color: "orange"
        },
        {
            title: "Configurações",
            description: "Configure sua conta",
            icon: Settings,
            path: "/dashboard/settings",
            color: "gray"
        }
    ];

    const stats = [
        {
            title: "Saldo Total",
            value: "R$ 12.450,00",
            change: "+5.2%",
            trend: "up",
            icon: TrendingUp
        },
        {
            title: "Gastos do Mês",
            value: "R$ 3.250,00",
            change: "-2.1%",
            trend: "down",
            icon: TrendingDown
        },
        {
            title: "Cartões Ativos",
            value: "4",
            change: "+1",
            trend: "up",
            icon: CreditCard
        }
    ];

    const handleActionClick = (path: string) => {
        router.push(path);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Dashboard</h1>
                <p className={styles.subtitle}>Bem-vindo ao Grex Finances</p>
            </div>

            {/* Stats Cards */}
            <div className={styles.statsGrid}>
                {stats.map((stat, index) => (
                    <div key={index} className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <stat.icon size={24} />
                        </div>
                        <div className={styles.statContent}>
                            <h3 className={styles.statTitle}>{stat.title}</h3>
                            <p className={styles.statValue}>{stat.value}</p>
                            <span className={`${styles.statChange} ${styles[stat.trend]}`}>
                                {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className={styles.quickActions}>
                <h2 className={styles.sectionTitle}>Ações Rápidas</h2>
                <div className={styles.actionsGrid}>
                    {quickActions.map((action, index) => (
                        <div
                            key={index}
                            className={`${styles.actionCard} ${styles[action.color]}`}
                            onClick={() => handleActionClick(action.path)}
                        >
                            <div className={styles.actionIcon}>
                                <action.icon size={32} />
                            </div>
                            <div className={styles.actionContent}>
                                <h3 className={styles.actionTitle}>{action.title}</h3>
                                <p className={styles.actionDescription}>{action.description}</p>
                            </div>
                            <div className={styles.actionArrow}>
                                <ArrowRight size={20} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
