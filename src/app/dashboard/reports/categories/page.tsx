"use client";

import React, { useState } from "react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import { ClientOnly } from "../../../../components/layout/ClientOnly";
import styles from "./Categories.module.css";
import {
    Download,
    Printer,
    ChevronDown
} from "lucide-react";

export default function Categories() {
    const [category, setCategory] = useState("Todas");
    const [period, setPeriod] = useState("Junho de 2024");
    const [regime1, setRegime1] = useState("Caixa");
    const [regime2, setRegime2] = useState("Todas");
    const [considerUnpaid, setConsiderUnpaid] = useState(false);

    const categories = [
        { name: "Dízimos e Ofertas", percentage: "74%", value: "R$250,00", color: "green" },
        { name: "Rendimentos", percentage: "74%", value: "R$-250,00", color: "green" },
        { name: "Encontro com Deus", percentage: "74%", value: "R$-250,00", color: "green" },
        { name: "Lanchonete", percentage: "74%", value: "R$-250,00", color: "red" },
        { name: "Livraria", percentage: "74%", value: "R$-250,00", color: "dark-red" },
        { name: "Outros", percentage: "74%", value: "R$-250,00", color: "light-red" }
    ];

    return (
        <DashboardLayout>
            <ClientOnly>
                <div className={styles.container}>
                    {/* Header */}
                    <div className={styles.header}>
                        <div className={styles.titleSection}>
                            <h1 className={styles.title}>Entradas e saídas por categorias</h1>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className={styles.filtersSection}>
                        <div className={styles.filtersRow}>
                            <div className={styles.filterGroup}>
                                <label className={styles.filterLabel}>Categoria</label>
                                <div className={styles.selectWrapper}>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className={styles.select}
                                    >
                                        <option value="Todas">Todas</option>
                                        <option value="Dízimos">Dízimos</option>
                                        <option value="Ofertas">Ofertas</option>
                                        <option value="Rendimentos">Rendimentos</option>
                                    </select>
                                    <ChevronDown size={16} className={styles.selectIcon} />
                                </div>
                            </div>

                            <div className={styles.filterGroup}>
                                <label className={styles.filterLabel}>Período</label>
                                <div className={styles.selectWrapper}>
                                    <select
                                        value={period}
                                        onChange={(e) => setPeriod(e.target.value)}
                                        className={styles.select}
                                    >
                                        <option value="Junho de 2024">Junho de 2024</option>
                                        <option value="Maio de 2024">Maio de 2024</option>
                                        <option value="Abril de 2024">Abril de 2024</option>
                                    </select>
                                    <ChevronDown size={16} className={styles.selectIcon} />
                                </div>
                            </div>

                            <div className={styles.filterGroup}>
                                <label className={styles.filterLabel}>Regime</label>
                                <div className={styles.selectWrapper}>
                                    <select
                                        value={regime1}
                                        onChange={(e) => setRegime1(e.target.value)}
                                        className={styles.select}
                                    >
                                        <option value="Caixa">Caixa</option>
                                        <option value="Competência">Competência</option>
                                    </select>
                                    <ChevronDown size={16} className={styles.selectIcon} />
                                </div>
                            </div>

                            <div className={styles.filterGroup}>
                                <label className={styles.filterLabel}>Conta</label>
                                <div className={styles.selectWrapper}>
                                    <select
                                        value={regime2}
                                        onChange={(e) => setRegime2(e.target.value)}
                                        className={styles.select}
                                    >
                                        <option value="Todas">Todas</option>
                                        <option value="Conta Corrente">Conta Corrente</option>
                                        <option value="Poupança">Poupança</option>
                                    </select>
                                    <ChevronDown size={16} className={styles.selectIcon} />
                                </div>
                            </div>

                            <div className={styles.toggleGroup}>
                                <label className={styles.toggleLabel}>
                                    <input
                                        type="checkbox"
                                        checked={considerUnpaid}
                                        onChange={(e) => setConsiderUnpaid(e.target.checked)}
                                        className={styles.toggleInput}
                                    />
                                    <span className={styles.toggleSlider}></span>
                                    Considerar não pagos
                                </label>
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
                                <h2>Relatório de entradas e saídas por categoria</h2>
                                <p className={styles.reportDescription}>
                                    De 20/09/2024 à 12/10/2024 | Visão Mensal | Conta Todas
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

                        {/* Charts Section */}
                        <div className={styles.chartsSection}>
                            <div className={styles.chartsContainer}>
                                {/* Income Chart */}
                                <div className={styles.chartContainer}>
                                    <h3 className={styles.chartTitle}>Entradas</h3>
                                    <div className={styles.donutChart}>
                                        <div className={styles.donutInner}>
                                            <div className={styles.donutSegment} style={{
                                                background: 'conic-gradient(#10b981 0deg 120deg, #059669 120deg 240deg, #047857 240deg 360deg)',
                                                borderRadius: '50%'
                                            }}></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Expenses Chart */}
                                <div className={styles.chartContainer}>
                                    <h3 className={styles.chartTitle}>Saídas</h3>
                                    <div className={styles.donutChart}>
                                        <div className={styles.donutInner}>
                                            <div className={styles.donutSegment} style={{
                                                background: 'conic-gradient(#ef4444 0deg 120deg, #dc2626 120deg 240deg, #991b1b 240deg 360deg)',
                                                borderRadius: '50%'
                                            }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Categories Table */}
                        <div className={styles.tableSection}>
                            <table className={styles.categoriesTable}>
                                <thead>
                                    <tr>
                                        <th>Cor</th>
                                        <th>Categoria</th>
                                        <th>Percentual</th>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className={`${styles.colorDot} ${styles[item.color]}`}></div>
                                            </td>
                                            <td>
                                                <div className={styles.categoryName}>
                                                    {item.name}
                                                    {index === categories.length - 1 && (
                                                        <input type="checkbox" className={styles.checkbox} />
                                                    )}
                                                </div>
                                            </td>
                                            <td className={styles.percentage}>{item.percentage}</td>
                                            <td className={styles.value}>{item.value}</td>
                                        </tr>
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
