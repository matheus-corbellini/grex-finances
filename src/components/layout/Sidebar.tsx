"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";
import {
  Home,
  DollarSign,
  CreditCard,
  CreditCard as CreditCardIcon,
  BarChart3,
  Users,
  Settings,
  HelpCircle,
  Shield,
  Ticket,
  FileText,
  LogOut,
  Bell,
  Filter,
  X
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: "Visão Geral", path: "/dashboard", icon: Home },
    { name: "Lançamentos", path: "/dashboard/transactions", icon: DollarSign },
    { name: "Contas e Carteiras", path: "/dashboard/accounts", icon: CreditCard },
    { name: "Cartões de Crédito", path: "/dashboard/cards", icon: CreditCardIcon },
    { name: "Relatórios", path: "/dashboard/reports", icon: BarChart3 },
    { name: "Contatos", path: "/dashboard/contacts", icon: Users },
  ];

  const configItems = [
    { name: "Configurações", path: "/dashboard/settings", icon: Settings },
    { name: "Ajuda", path: "/dashboard/help", icon: HelpCircle },
    { name: "Política de Privacidade", path: "/dashboard/privacy", icon: Shield },
    { name: "Abrir Ticket de Suporte", path: "/dashboard/support", icon: Ticket },
    { name: "Termos de Uso", path: "/dashboard/terms", icon: FileText },
  ];

  const handleLogout = () => {
    console.log("Logout clicked");
    router.push("/login");
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className={styles.overlay}
          onClick={onToggle}
        />
      )}

      <div
        className={`${styles.sidebarContainer} ${isOpen ? styles.open : styles.closed}`}
      >
        {/* Header with Close Button for Mobile */}
        <div className={styles.headerSection}>
          {/* Mobile Close Button */}
          <button
            onClick={onToggle}
            className={styles.mobileCloseButton}
          >
            <X size={18} />
          </button>

          {/* User Profile Section */}
          <div className={styles.userProfileContainer}>
            {/* Profile Avatar */}
            <div className={styles.profileAvatar}>
              ML
            </div>

            {/* User Info */}
            {isOpen && (
              <div className={styles.userInfo}>
                <div className={styles.userName}>
                  Maria Lúcia
                </div>
                <div className={styles.userRole}>
                  Lider
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notifications and Filters */}
        {isOpen && (
          <div className={styles.notificationsSection}>
            <div className={styles.notificationsContainer}>
              {/* Notifications Icon */}
              <button className={styles.notificationsButton}>
                <Bell size={18} color="currentColor" />
              </button>

              {/* Filter Buttons */}
              <div className={styles.filterButtonsContainer}>
                <button className={styles.filterButton}>
                  Mês
                </button>
                <button className={`${styles.filterButton} ${styles.secondary}`}>
                  Semana
                </button>
                <button className={`${styles.filterButton} ${styles.icon} ${styles.secondary}`}>
                  <Filter size={14} color="currentColor" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Menu */}
        <div className={styles.mainMenuSection}>
          <nav>
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={`${styles.menuButton} ${isOpen ? '' : styles.closed} ${isActive ? styles.active : ''}`}
                >
                  <item.icon
                    size={20}
                    className={styles.menuIcon}
                  />
                  {isOpen && (
                    <span className={styles.menuText}>
                      {item.name}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Configuration Menu */}
        <div className={styles.configMenuSection}>
          {configItems.map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`${styles.configButton} ${isOpen ? '' : styles.closed}`}
            >
              <item.icon
                size={16}
                className={styles.configIcon}
              />
              {isOpen && (
                <span className={styles.configText}>
                  {item.name}
                </span>
              )}
            </button>
          ))}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`${styles.logoutButton} ${isOpen ? '' : styles.closed}`}
          >
            <LogOut
              size={16}
              className={styles.logoutIcon}
            />
            {isOpen && (
              <span className={styles.logoutText}>
                Sair
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
