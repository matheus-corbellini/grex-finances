"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown, Bell, Settings, History } from "lucide-react";
import styles from "./NotificationsDropdown.module.css";

interface NotificationsDropdownProps {
    isOpen: boolean;
}

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ isOpen }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const isNotificationsActive = pathname.startsWith('/dashboard/notifications');

    const notificationItems = [
        {
            name: "Configurações",
            path: "/dashboard/notifications/settings",
            icon: Settings,
            description: "Configurar notificações"
        },
        {
            name: "Histórico",
            path: "/dashboard/notifications/history",
            icon: History,
            description: "Ver histórico de notificações"
        },
    ];

    const handleItemClick = (path: string) => {
        router.push(path);
        setIsDropdownOpen(false);
    };

    const handleToggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => router.push("/dashboard/notifications/settings")}
                className={`${styles.menuButton} ${styles.closed} ${isNotificationsActive ? styles.active : ''}`}
            >
                <Bell size={20} className={styles.menuIcon} />
            </button>
        );
    }

    return (
        <div className={styles.dropdownContainer}>
            <button
                onClick={handleToggleDropdown}
                className={`${styles.menuButton} ${isNotificationsActive ? styles.active : ''}`}
            >
                <Bell size={20} className={styles.menuIcon} />
                <span className={styles.menuText}>
                    Notificações
                </span>
                <ChevronDown
                    size={16}
                    className={`${styles.chevron} ${isDropdownOpen ? styles.rotated : ''}`}
                />
            </button>

            {isDropdownOpen && (
                <div className={styles.dropdown}>
                    {notificationItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => handleItemClick(item.path)}
                                className={`${styles.dropdownItem} ${isActive ? styles.active : ''}`}
                            >
                                <item.icon size={16} className={styles.dropdownIcon} />
                                <div className={styles.dropdownContent}>
                                    <span className={styles.dropdownText}>{item.name}</span>
                                    <span className={styles.dropdownDescription}>{item.description}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
