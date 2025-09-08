"use client";

import React, { useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown, BarChart3 } from "lucide-react";
import styles from "./ReportsDropdown.module.css";

interface ReportsDropdownProps {
  isOpen: boolean;
}

export const ReportsDropdown: React.FC<ReportsDropdownProps> = ({ isOpen }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Memoize pathname comparisons to prevent unnecessary re-renders
  const isReportsActive = useMemo(() => {
    if (typeof window === 'undefined') return false;
    try {
      return pathname.startsWith('/dashboard/reports');
    } catch (error) {
      return false;
    }
  }, [pathname]);

  const reportItems = [
    {
      name: "Análise de entradas e saídas",
      path: "/dashboard/reports/analysis-entries-exits",
      description: "Análise geral de entradas e saídas"
    },
    {
      name: "Relatório de fluxo de caixa",
      path: "/dashboard/reports/cash-flow",
      description: "Fluxo de caixa realizado"
    },
    {
      name: "Entradas e saídas por categorias",
      path: "/dashboard/reports/categories",
      description: "Análise por categorias"
    },
    {
      name: "DRE Gerencial",
      path: "/dashboard/reports/income-statement",
      description: "Demonstração do resultado"
    },
    {
      name: "Entradas x saídas por contas bancárias",
      path: "/dashboard/reports/bank-accounts",
      description: "Análise por contas bancárias"
    }
  ];


  const handleReportClick = (path: string) => {
    router.push(path);
    setDropdownOpen(false);
  };

  return (
    <div className={styles.reportsContainer}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className={`${styles.reportsButton} ${isOpen ? '' : styles.closed} ${isReportsActive ? styles.active : ''}`}
      >
        <BarChart3
          size={20}
          className={styles.menuIcon}
        />
        {isOpen && (
          <>
            <span className={styles.menuText}>
              Relatórios
            </span>
            <ChevronDown
              size={16}
              className={`${styles.chevron} ${dropdownOpen ? styles.rotated : ''}`}
            />
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && dropdownOpen && (
        <div className={styles.dropdownMenu}>
          {reportItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleReportClick(item.path)}
                className={`${styles.dropdownItem} ${isActive ? styles.active : ''}`}
              >
                <div className={styles.dropdownItemContent}>
                  <div className={styles.dropdownItemName}>
                    {item.name}
                  </div>
                  <div className={styles.dropdownItemDescription}>
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReportsDropdown;
