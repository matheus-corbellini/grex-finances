"use client";

import React, { useState } from "react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import { ClientOnly } from "../../../../components/layout/ClientOnly";
import styles from "./BankAccounts.module.css";
import {
    Download,
    Printer,
    ChevronDown
} from "lucide-react";

export default function BankAccounts() {
    const [period, setPeriod] = useState("Dezembro 2024");
    const [view, setView] = useState("Mensal");
    const [regime, setRegime] = useState("Caixa");
    const [considerUnpaid, setConsiderUnpaid] = useState(false);

    return (
        <DashboardLayout>
            <ClientOnly>
                <div className={styles.container}>
                    {/* Header */}
                    <div className={styles.header}>
                        <div className={styles.titleSection}>
                            <h1 className={styles.title}>Entradas x saídas por contas bancárias</h1>
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
                                        <option value="Dezembro 2024">Dezembro 2024</option>
                                        <option value="Novembro 2024">Novembro 2024</option>
                                        <option value="Outubro 2024">Outubro 2024</option>
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
                                <h2>Relatório de entradas x saídas da conta Banco Coorperativo Sicredi S.A.</h2>
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

                        {/* Chart Section */}
                        <div className={styles.chartSection}>
                            <div className={styles.chartContainer}>
                                <div className={styles.chart}>
                                    <div className={styles.chartBars}>
                                        <div className={styles.barContainer}>
                                            <div className={`${styles.bar} ${styles.entryBar}`} style={{ height: '70%' }}></div>
                                            <div className={styles.barLabel}>Entrada</div>
                                        </div>
                                        <div className={styles.barContainer}>
                                            <div className={`${styles.bar} ${styles.exitBar}`} style={{ height: '40%' }}></div>
                                            <div className={styles.barLabel}>Saída</div>
                                        </div>
                                    </div>
                                    <div className={styles.chartAxis}>
                                        <div className={styles.yAxis}>
                                            <div className={styles.yLabel}>R$-250,00</div>
                                            <div className={styles.yLabel}>R$-200,00</div>
                                            <div className={styles.yLabel}>R$-150,00</div>
                                            <div className={styles.yLabel}>R$-100,00</div>
                                            <div className={styles.yLabel}>R$-50,00</div>
                                        </div>
                                        <div className={styles.xAxis}>
                                            <div className={styles.xLabel}>DEZ</div>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.chartLegend}>
                                    <div className={styles.legendItem}>
                                        <div className={`${styles.legendDot} ${styles.entryDot}`}></div>
                                        <span>Entrada</span>
                                    </div>
                                    <div className={styles.legendItem}>
                                        <div className={`${styles.legendDot} ${styles.exitDot}`}></div>
                                        <span>Saída</span>
                                    </div>
                                    <div className={styles.legendItem}>
                                        <div className={`${styles.legendDot} ${styles.balanceDot}`}></div>
                                        <span>Saldo</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary Table */}
                        <div className={styles.tableSection}>
                            <table className={styles.summaryTable}>
                                <thead>
                                    <tr>
                                        <th>Período</th>
                                        <th>Entradas</th>
                                        <th>Saídas</th>
                                        <th>Resultado</th>
                                        <th>Saldo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Dez de 2024</td>
                                        <td className={styles.entryValue}>R$-250,00</td>
                                        <td className={styles.exitValue}>R$-250,00</td>
                                        <td className={styles.resultValue}>R$-250,00</td>
                                        <td className={styles.balanceValue}>R$-250,00</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </ClientOnly>
        </DashboardLayout>
    );
}
