"use client";

import React, { useState } from "react";
import styles from "./Header.module.css";
import { ChevronDown, Plus, ChevronLeft, ChevronRight, Menu } from "lucide-react";

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric'
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  return (
    <header className={styles.header}>
      {/* Left Section - Logo and Navigation */}
      <div className={styles.leftSection}>
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuToggle}
          className={styles.mobileMenuButton}
        >
          <Menu size={24} />
        </button>

        {/* Logo */}
        <div className={styles.brand}>
          Grex
        </div>

        {/* Navigation Menu */}
        <nav className={styles.navigationMenu}>
          {/* Financeiro Dropdown */}
          <div style={{ position: "relative" }}>
            <button className={styles.navLink}>
              Financeiro
              <ChevronDown size={12} />
            </button>
          </div>

          {/* Visão Geral */}
          <button className={`${styles.navLink} ${styles.active}`}>
            Visão geral
          </button>

          {/* Título da página */}
          <span className={styles.navText}>
            - Relatórios
          </span>

          {/* Add Button */}
          <button className={styles.addButton}>
            <Plus size={16} />
            Adicionar
          </button>
        </nav>
      </div>

      {/* Right Section - Date Navigation */}
      <div className={styles.rightSection}>
        {/* Date Navigation */}
        <div className={styles.dateNavigation}>
          <button
            className={styles.dateButton}
            onClick={() => navigateMonth('prev')}
          >
            <ChevronLeft size={14} />
          </button>

          <span className={styles.currentDate}>
            {formatDate(currentDate)}
          </span>

          <button
            className={styles.dateButton}
            onClick={() => navigateMonth('next')}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
