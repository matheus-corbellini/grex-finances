"use client";

import React, { useState } from "react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import { ClientOnly } from "../../../../components/layout/ClientOnly";
import styles from "./IncomeStatement.module.css";
import {
    Download,
    Printer,
    ChevronDown
} from "lucide-react";

export default function IncomeStatement() {
    const [period, setPeriod] = useState("2024");
    const [view, setView] = useState("Mensal");
    const [regime, setRegime] = useState("Caixa");

    const dreData = [
        {
            category: "Receitas operacionais",
            color: "green",
            items: [
                { name: "Prestação de serviços", values: ["R$-250,00", "R$-250,00", "R$-250,00", "R$-250,00", "R$-250,00", "R$-250,00"] },
                { name: "Venda de produtos", values: ["R$-250,00", "R$-250,00", "R$-250,00", "R$-250,00", "R$-250,00", "R$-250,00"] },
                { name: "Outras receitas", values: ["R$-250,00", "R$-250,00", "R$-250,00", "R$-250,00", "R$-250,00", "R$-250,00"] }
            ]
        },
        {
            category: "Deduções das receitas",
            color: "red",
            items: [
                { name: "Prestação de serviços", values: ["R$-250,00", "R$-250,00", "R$-250,00", "R$-250,00", "R$-250,00", "R$-250,00"] },
                { name: "Venda de produtos", values: ["R$-250,00", "R$-250,00", "R$-250,00", "R$-250,00", "R$-250,00", "R$-250,00"] },
                { name: "Outras receitas", values: ["R$-250,00", "R$-250,00", "R$-250,00", "R$-250,00", "R$-250,00", "R$-250,00"] }
            ]
        },
        {
            category: "Receita liquida",
            color: "blue",
            items: []
        },
        {
            category: "Custos variáveis",
            color: "red",
            items: [
                { name: "Prestação de serviços", values: ["R$-250,00", "R$-250,00", "R$-250,00", "R$-250,00", "R$-250,00", "R$-250,00"] },
                { name: "Venda de produtos", values: ["R$-250,00", "R$-250,00", "R$-250,00", "R$-250,00", "R$-250,00", "R$-250,00"] }
            ]
        }
    ];

    return (
        <DashboardLayout>
            <ClientOnly>
                <div className={styles.container}>
                    {/* Header */}
                    <div className={styles.header}>
                        <div className={styles.titleSection}>
                            <h1 className={styles.title}>DRE Gerencial</h1>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className={styles.filtersSection}>
                        <div className={styles.filtersRow}>
                            <div className={styles.filterGroup}>
                                <label className={styles.filterLabel}>Período</label>
                                <div className={styles.selectWrapper}>
                                    <select
                                        value={period}
                                        onChange={(e) => setPeriod(e.target.value)}
                                        className={styles.select}
                                    >
                                        <option value="2024">2024</option>
                                        <option value="2023">2023</option>
                                        <option value="2022">2022</option>
                                    </select>
                                    <ChevronDown size={16} className={styles.selectIcon} />
                                </div>
                            </div>

                            <div className={styles.filterGroup}>
                                <label className={styles.filterLabel}>Visão</label>
                                <div className={styles.selectWrapper}>
                                    <select
                                        value={view}
                                        onChange={(e) => setView(e.target.value)}
                                        className={styles.select}
                                    >
                                        <option value="Mensal">Mensal</option>
                                        <option value="Semanal">Semanal</option>
                                        <option value="Diária">Diária</option>
                                    </select>
                                    <ChevronDown size={16} className={styles.selectIcon} />
                                </div>
                            </div>

                            <div className={styles.filterGroup}>
                                <label className={styles.filterLabel}>Regime</label>
                                <div className={styles.selectWrapper}>
                                    <select
                                        value={regime}
                                        onChange={(e) => setRegime(e.target.value)}
                                        className={styles.select}
                                    >
                                        <option value="Caixa">Caixa</option>
                                        <option value="Competência">Competência</option>
                                    </select>
                                    <ChevronDown size={16} className={styles.selectIcon} />
                                </div>
                            </div>

                            <button className={styles.generateButton}>
                                Gerar relatório
                            </button>
                        </div>
                    </div>

                    {/* Report Content */}
                    <div className={styles.reportSection}>
                        <div className={styles.reportHeader}>
                            <div className={styles.reportTitle}>
                                <h2>DRE Gerencial</h2>
                                <p className={styles.reportDescription}>
                                    De 20/09/2024 à 12/10/2024 | Visão Mensal | Regime Caixa
                                </p>
                            </div>
                            <div className={styles.reportActions}>
                                <button className={styles.actionButton}>
                                    <Download size={16} />
                                    Exportar
                                </button>
                                <button className={styles.actionButton}>
                                    <Printer size={16} />
                                    Imprimir
                                </button>
                            </div>
                        </div>

                        {/* DRE Table */}
                        <div className={styles.tableSection}>
                            <table className={styles.dreTable}>
                                <thead>
                                    <tr>
                                        <th>Período</th>
                                        <th>Jan de 2024</th>
                                        <th>Jan de 2024</th>
                                        <th>Jan de 2024</th>
                                        <th>Jan de 2024</th>
                                        <th>Jan de 2024</th>
                                        <th>Jan de 2024</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dreData.map((section, sectionIndex) => (
                                        <React.Fragment key={sectionIndex}>
                                            <tr className={styles.sectionHeader}>
                                                <td className={styles.sectionTitle}>
                                                    <div className={styles.sectionTitleContent}>
                                                        <div className={`${styles.sectionDot} ${styles[section.color]}`}></div>
                                                        {section.category}
                                                    </div>
                                                </td>
                                                <td colSpan={6}></td>
                                            </tr>
                                            {section.items.map((item, itemIndex) => (
                                                <tr key={itemIndex} className={styles.itemRow}>
                                                    <td className={styles.itemName}>{item.name}</td>
                                                    {item.values.map((value, valueIndex) => (
                                                        <td
                                                            key={valueIndex}
                                                            className={`${styles.itemValue} ${valueIndex === item.values.length - 1 ? styles.highlightedValue : ''}`}
                                                        >
                                                            {value}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </ClientOnly>
        </DashboardLayout>
    );
}
