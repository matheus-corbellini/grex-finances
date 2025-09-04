"use client";

import React, { useState, useEffect, useLayoutEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "./DashboardLayout.module.css";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useLayoutEffect(() => {
    // Verificar se estamos no cliente
    if (typeof window === 'undefined') return;

    // Define o estado inicial baseado no tamanho da tela
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Delay para garantir que a hidratação esteja completa
    const timer = setTimeout(() => {
      handleResize();

      // Adicionar event listener apenas se o window existir
      if (window && typeof window.addEventListener === 'function') {
        window.addEventListener('resize', handleResize);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      // Remover event listener apenas se o window existir
      if (window && typeof window.removeEventListener === 'function') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  return (
    <div className={`${styles.mainContainer} ${sidebarOpen ? '' : styles.sidebarClosed}`}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <div className={styles.contentWrapper}>
        {/* Header */}
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content */}
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </div>
  );
};

export { DashboardLayout };
export default DashboardLayout;
