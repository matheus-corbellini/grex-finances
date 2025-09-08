"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "./DashboardLayout.module.css";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Verificar se estamos no cliente
    if (typeof window === 'undefined') return;

    // Define o estado inicial baseado no tamanho da tela
    const handleResize = () => {
      const shouldOpen = window.innerWidth >= 768;
      setSidebarOpen(prev => prev !== shouldOpen ? shouldOpen : prev);
    };

    // Configurar estado inicial
    handleResize();

    // Adicionar event listener
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
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
