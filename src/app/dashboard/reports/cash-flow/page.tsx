"use client";

import React, { useState } from "react";
import DashboardLayout from "../../../../components/layout/DashboardLayout";
import { ClientOnly } from "../../../../components/layout/ClientOnly";
import styles from "./CashFlow.module.css";
import {
  Download,
  Printer,
  ChevronDown
} from "lucide-react";

export default function CashFlow() {
  const [period, setPeriod] = useState("2024");
  const [view, setView] = useState("Mensal");
  const [type, setType] = useState("Realizado");

  return (
    <DashboardLayout>
      <ClientOnly>
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.titleSection}>
              <h1 className={styles.title}>Relatório de fluxo de caixa</h1>
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
                <label className={styles.filterLabel}>Tipo</label>
                <div className={styles.selectWrapper}>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className={styles.select}
                  >
                    <option value="Realizado">Realizado</option>
                    <option value="Previsto">Previsto</option>
                    <option value="Comparativo">Comparativo</option>
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
                <h2>Relatório de fluxo de caixa realizado</h2>
                <p className={styles.reportDescription}>
                  De 20/09/2024 à 12/10/2024 | Visão Mensal
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
                  <div className={styles.chartContent}>
                    {/* Stacked Bar Chart */}
                    <div className={styles.barsContainer}>
                      {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'].map((month, index) => (
                        <div key={month} className={styles.monthContainer}>
                          <div className={styles.barStack}>
                            <div
                              className={`${styles.bar} ${styles.entryBar}`}
                              style={{ height: `${Math.random() * 60 + 20}%` }}
                            ></div>
                            <div
                              className={`${styles.bar} ${styles.exitBar}`}
                              style={{ height: `${Math.random() * 40 + 10}%` }}
                            ></div>
                          </div>
                          <div className={styles.monthLabel}>{month}</div>
                        </div>
                      ))}
                    </div>

                    {/* Line Chart for Balance */}
                    <div className={styles.lineContainer}>
                      <div className={styles.lineChart}>
                        <div className={styles.linePath}></div>
                      </div>
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
                  </div>
                </div>
                <div className={styles.chartLegend}>
                  <div className={styles.legendItem}>
                    <div className={`${styles.legendDot} ${styles.entryDot}`}></div>
                    <span>Entrada realizada</span>
                  </div>
                  <div className={styles.legendItem}>
                    <div className={`${styles.legendDot} ${styles.exitDot}`}></div>
                    <span>Saída realizada</span>
                  </div>
                  <div className={styles.legendItem}>
                    <div className={`${styles.legendDot} ${styles.balanceDot}`}></div>
                    <span>Saldo realizado</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className={styles.tableSection}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Período</th>
                    <th>Jan de 2024 AH</th>
                    <th>Fev de 2024 AH</th>
                    <th>Mar de 2024 AH</th>
                    <th>Abr de 2024 AH</th>
                    <th>Mai de 2024 AH</th>
                    <th>Jun de 2024 AH</th>
                    <th>Jul de 2024 AH</th>
                    <th>Ago de 2024 AH</th>
                    <th>Set de 2024 AH</th>
                    <th>Out de 2024 AH</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Total de saldos</td>
                    <td>R$-250,00 32%</td>
                    <td>R$-250,00 32%</td>
                    <td>R$-250,00 32%</td>
                    <td>R$-250,00 32%</td>
                    <td>R$-250,00 32%</td>
                    <td>R$-250,00 32%</td>
                    <td>R$-250,00 32%</td>
                    <td>R$-250,00 32%</td>
                    <td>R$-250,00 32%</td>
                    <td>R$-250,00 32%</td>
                  </tr>
                  <tr>
                    <td>Saldo anterior</td>
                    <td>R$-250,00 32%</td>
                    <td>R$-250,00 32%</td>
                    <td>R$-250,00 32%</td>
                    <td>R$-250,00 32%</td>
                    <td>R$-250,00 32%</td>
                    <td>R$-250,00 32%</td>
                    <td>R$-250,00 32%</td>
                    <td>R$-250,00 32%</td>
                    <td>R$-250,00 32%</td>
                    <td>R$-250,00 32%</td>
                  </tr>
                  <tr>
                    <td>Saldo inicial</td>
                    <td>R$-250,00 32%</td>
                    <td>R$-250,00 32%</td>
                    <td>R$-250,00 32%</td>
                    <td>R$-250,00 32%</td>
                    <td>R$-250,00 32%</td>
                    <td>R$-250,00 32%</td>
                    <td>R$-250,00 32%</td>
                    <td>R$-250,00 32%</td>
                    <td>R$-250,00 32%</td>
                    <td className={styles.highlightedValue}>R$250,00</td>
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